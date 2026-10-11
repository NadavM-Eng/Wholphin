$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'environment.ps1')
$WholphinVenv = Join-Path $WholphinRuntime 'grpc-venv'
$WholphinPython = Join-Path $WholphinVenv 'Scripts/python.exe'
if (-not (Test-Path -LiteralPath $WholphinPython)) {
    & py -3.13 -m venv $WholphinVenv
    if ($LASTEXITCODE -ne 0) { throw 'Python 3.13 virtual environment creation failed' }
}
& $WholphinPython -m pip install -r (Join-Path $PSScriptRoot 'requirements.txt')
if ($LASTEXITCODE -ne 0) { throw 'Python dependency installation failed' }
$WholphinProto = Join-Path $WholphinSdk 'emulator/lib/emulator_controller.proto'
if (-not (Test-Path -LiteralPath $WholphinProto)) { throw 'Install the official Android emulator before generating its API bindings' }
$WholphinProtoIncludes = & $WholphinPython -c "import pathlib, grpc_tools; print(pathlib.Path(grpc_tools.__file__).parent / '_proto')"
& $WholphinPython -m grpc_tools.protoc "--proto_path=$(Split-Path $WholphinProto -Parent)" "--proto_path=$WholphinProtoIncludes" "--python_out=$WholphinRuntime" "--grpc_python_out=$WholphinRuntime" $WholphinProto
if ($LASTEXITCODE -ne 0) { throw 'Emulator protobuf generation failed' }
$WholphinScripts = @(Get-ChildItem -LiteralPath $PSScriptRoot -Filter '*.py' -File | ForEach-Object FullName)
& $WholphinPython -m py_compile @WholphinScripts
if ($LASTEXITCODE -ne 0) { throw 'Runtime Python syntax check failed' }
Write-Output 'Streaming dependencies, protobuf bindings and Python syntax checks are ready.'
