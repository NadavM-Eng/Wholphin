param([switch]$StopServer)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'environment.ps1')
$WholphinListener = @(Get-NetTCPConnection -LocalPort 18765 -State Listen -ErrorAction SilentlyContinue)
if ($WholphinListener.Count) {
    if ($WholphinListener.Count -ne 1 -or $WholphinListener[0].LocalAddress -ne '127.0.0.1') { throw 'Unexpected viewer listener' }
    $WholphinOwner = Get-CimInstance Win32_Process -Filter "ProcessId = $($WholphinListener[0].OwningProcess)"
    $WholphinExpected = (Join-Path $PSScriptRoot 'stream-server.py').Replace('\','/')
    if (-not (($WholphinOwner.CommandLine -replace '\\','/').Contains($WholphinExpected))) { throw 'Viewer port belongs to a different application' }
    Stop-Process -Id $WholphinOwner.ProcessId
}
$WholphinDevices = (& $WholphinAdb devices) -join "`n"
if ($WholphinDevices -match 'emulator-5560\s+device') {
    $WholphinAvd = @(& $WholphinAdb -s emulator-5560 emu avd name | Where-Object { $_.Trim() -and $_.Trim() -ne 'OK' })
    if ($WholphinAvd.Count -ne 1 -or $WholphinAvd[0].Trim() -ne 'WholphinTV36') { throw 'Refusing to stop an unrelated emulator' }
    & $WholphinAdb -s emulator-5560 shell am force-stop org.wholphin.runtime.control
    & $WholphinAdb -s emulator-5560 forward --remove tcp:18666
    & $WholphinAdb -s emulator-5560 emu kill
    $WholphinDeadline = (Get-Date).AddSeconds(45)
    do {
        $WholphinDevices = (& $WholphinAdb devices) -join "`n"
        if ($WholphinDevices -notmatch 'emulator-5560\s') { break }
        Start-Sleep -Milliseconds 250
    } while ((Get-Date) -lt $WholphinDeadline)
    if ($WholphinDevices -match 'emulator-5560\s') { throw 'Emulator has not finished shutting down' }
}
if ($StopServer) {
    $WholphinDocker = docker inspect wholphin-runtime-jellyfin 2>$null | ConvertFrom-Json
    if ($LASTEXITCODE -eq 0) {
        $WholphinMount = @($WholphinDocker.Mounts | Where-Object Destination -eq '/config')
        $WholphinExpected = (Join-Path $WholphinRuntime 'jellyfin/config').Replace('\','/').ToLowerInvariant()
        if ($WholphinMount.Count -ne 1 -or $WholphinMount[0].Source.Replace('\','/').ToLowerInvariant() -ne $WholphinExpected) { throw 'Container belongs to a different installation' }
        docker stop wholphin-runtime-jellyfin | Out-Null
    }
}
Write-Output 'Stopped the dedicated runtime. Its saved data is retained.'
