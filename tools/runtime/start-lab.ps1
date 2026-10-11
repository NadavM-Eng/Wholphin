param([switch]$RestartViewer)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'environment.ps1')
if (-not (Test-Path -LiteralPath $WholphinEmulator)) { throw 'SDK not installed; see research/runtime-results.md' }
$WholphinDocker = docker inspect wholphin-runtime-jellyfin 2>$null | ConvertFrom-Json
if ($LASTEXITCODE -ne 0) { throw 'The isolated Jellyfin container is missing; see research/runtime-results.md' }
$WholphinMount = @($WholphinDocker.Mounts | Where-Object Destination -eq '/config')
$WholphinExpectedConfig = (Join-Path $WholphinRuntime 'jellyfin/config').Replace('\','/').ToLowerInvariant()
if ($WholphinMount.Count -ne 1 -or $WholphinMount[0].Source.Replace('\','/').ToLowerInvariant() -ne $WholphinExpectedConfig) { throw 'Container name belongs to a different installation' }
if (-not $WholphinDocker.State.Running) { docker start wholphin-runtime-jellyfin | Out-Null }
$WholphinDevices = (& $WholphinAdb devices) -join "`n"
if ($WholphinDevices -notmatch 'emulator-5560\s+device') {
    $WholphinPorts = @(Get-NetTCPConnection -LocalPort 5560,8560 -State Listen -ErrorAction SilentlyContinue)
    if ($WholphinPorts.Count) { throw 'Emulator ports are occupied by another process' }
    $WholphinProcess = Start-Process -FilePath $WholphinEmulator -ArgumentList @('-avd','WholphinTV36','-port','5560','-grpc','8560','-grpc-use-token','-gpu','host','-memory','4096','-cores','4','-no-window','-no-boot-anim','-no-snapshot') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $WholphinRuntime 'emulator-stdout.log') -RedirectStandardError (Join-Path $WholphinRuntime 'emulator-stderr.log') -PassThru
    $WholphinProcess.Id | Set-Content -LiteralPath (Join-Path $WholphinRuntime 'emulator.pid')
}
$WholphinDeadline = (Get-Date).AddMinutes(3)
do {
    try { $WholphinBooted = ((& $WholphinAdb -s emulator-5560 shell getprop sys.boot_completed 2>$null) | Out-String).Trim() -eq '1' } catch { $WholphinBooted = $false }
    if ($WholphinBooted) { break }
    Start-Sleep -Seconds 1
} while ((Get-Date) -lt $WholphinDeadline)
if (-not $WholphinBooted) { throw 'Emulator did not finish booting; inspect the emulator log' }
$WholphinAvd = @(& $WholphinAdb -s emulator-5560 emu avd name | Where-Object { $_.Trim() -and $_.Trim() -ne 'OK' })
if ($WholphinAvd.Count -ne 1 -or $WholphinAvd[0].Trim() -ne 'WholphinTV36') { throw 'emulator-5560 is not the dedicated WholphinTV36 AVD' }
$WholphinApk = Join-Path $WholphinRuntime 'Wholphin-v1.0.8-x86_64.apk'
$WholphinInstalled = & $WholphinAdb -s emulator-5560 shell pm path com.github.damontecres.wholphin
if (-not ($WholphinInstalled -match '^package:')) {
    if ((Get-FileHash -LiteralPath $WholphinApk -Algorithm SHA256).Hash.ToLowerInvariant() -ne '74ba578c1059968c10c0884cc290d74a84793d9b78713beb0805baef7fb0a53f') { throw 'Original release APK checksum does not match' }
    & $WholphinAdb -s emulator-5560 install $WholphinApk
    if ($LASTEXITCODE -ne 0) { throw 'Original APK installation failed' }
}
$WholphinControlPackage = & $WholphinAdb -s emulator-5560 shell pm path org.wholphin.runtime.control
if (-not ($WholphinControlPackage -match '^package:')) {
    $WholphinControlApk = Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot 'automation-app/build/outputs/apk/debug') -Filter '*.apk' | Select-Object -First 1
    if (-not $WholphinControlApk) { throw 'Build the input adapter first; see research/runtime-results.md' }
    & $WholphinAdb -s emulator-5560 install $WholphinControlApk.FullName
    if ($LASTEXITCODE -ne 0) { throw 'Input adapter installation failed' }
}
& $WholphinAdb -s emulator-5560 forward tcp:18666 tcp:18666 | Out-Null
$WholphinControlRunning = & $WholphinAdb -s emulator-5560 shell pidof org.wholphin.runtime.control
if (-not $WholphinControlRunning) {
    $WholphinProcess = Start-Process -FilePath $WholphinAdb -ArgumentList @('-s','emulator-5560','shell','am','instrument','-w','org.wholphin.runtime.control/.ControlInstrumentation') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $WholphinRuntime 'control-stdout.log') -RedirectStandardError (Join-Path $WholphinRuntime 'control-stderr.log') -PassThru
    $WholphinProcess.Id | Set-Content -LiteralPath (Join-Path $WholphinRuntime 'control-helper.pid')
}
& $WholphinAdb -s emulator-5560 shell am start -n com.github.damontecres.wholphin/.MainActivity | Out-Null
& (Join-Path $PSScriptRoot 'start-viewer.ps1') -Restart:$RestartViewer
