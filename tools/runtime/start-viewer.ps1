param([switch]$Restart)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'environment.ps1')
$WholphinPython = Join-Path $WholphinRuntime 'grpc-venv/Scripts/python.exe'
$WholphinServerPath = Join-Path $PSScriptRoot 'stream-server.py'
if (-not (Test-Path -LiteralPath $WholphinPython)) { throw 'Run the runtime setup instructions first: research/runtime-results.md' }
$WholphinListener = @(Get-NetTCPConnection -LocalPort 18765 -State Listen -ErrorAction SilentlyContinue)
if ($WholphinListener.Count) {
    if ($WholphinListener.Count -ne 1 -or $WholphinListener[0].LocalAddress -ne '127.0.0.1') { throw 'Unexpected listener on 18765' }
    $WholphinOwner = Get-CimInstance Win32_Process -Filter "ProcessId = $($WholphinListener[0].OwningProcess)"
    $WholphinExpected = $WholphinServerPath.Replace('\', '/')
    if (-not (($WholphinOwner.CommandLine -replace '\\', '/').Contains($WholphinExpected))) { throw 'Port 18765 belongs to a different application' }
    if (-not $Restart) {
        Invoke-RestMethod 'http://127.0.0.1:18765/health'
        return
    }
    Stop-Process -Id $WholphinOwner.ProcessId
}
& $WholphinPython -m py_compile $WholphinServerPath
if ($LASTEXITCODE -ne 0) { throw 'Viewer syntax check failed' }
$WholphinProcess = Start-Process -FilePath $WholphinPython -ArgumentList @('"' + $WholphinServerPath + '"') -WorkingDirectory $WholphinWorkspace -WindowStyle Hidden -RedirectStandardOutput (Join-Path $WholphinRuntime 'stream-stdout.log') -RedirectStandardError (Join-Path $WholphinRuntime 'stream-stderr.log') -PassThru
$WholphinProcess.Id | Set-Content -LiteralPath (Join-Path $WholphinRuntime 'stream-launcher.pid')
$WholphinDeadline = (Get-Date).AddSeconds(15)
do {
    try {
        $WholphinHealth = Invoke-RestMethod 'http://127.0.0.1:18765/health'
        $WholphinListener = Get-NetTCPConnection -LocalPort 18765 -State Listen
        $WholphinListener.OwningProcess | Set-Content -LiteralPath (Join-Path $WholphinRuntime 'stream.pid')
        Write-Output 'Wholphin viewer: http://127.0.0.1:18765/'
        return $WholphinHealth
    } catch { Start-Sleep -Milliseconds 250 }
} while ((Get-Date) -lt $WholphinDeadline)
throw 'Viewer did not start; inspect .research-cache/runtime/stream-stderr.log'
