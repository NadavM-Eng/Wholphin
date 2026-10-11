# Dot-source this file in a local PowerShell session to use the isolated lab.
$WholphinWorkspace = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..'))
$WholphinRuntime = Join-Path $WholphinWorkspace '.research-cache\runtime'
$WholphinSdk = Join-Path $WholphinWorkspace '.research-cache\android-sdk'
$WholphinAdb = Join-Path $WholphinSdk 'platform-tools\adb.exe'
$WholphinEmulator = Join-Path $WholphinSdk 'emulator\emulator.exe'
$WholphinSdkManager = Join-Path $WholphinSdk 'cmdline-tools\latest\bin\sdkmanager.bat'
$WholphinAvdManager = Join-Path $WholphinSdk 'cmdline-tools\latest\bin\avdmanager.bat'
$env:ANDROID_HOME = $WholphinSdk
$env:ANDROID_SDK_ROOT = $WholphinSdk
$env:ANDROID_USER_HOME = Join-Path $WholphinRuntime 'android-user'
$env:ANDROID_AVD_HOME = Join-Path $WholphinRuntime 'avd'
$env:ANDROID_EMULATOR_HOME = $env:ANDROID_USER_HOME
New-Item -ItemType Directory -Path $env:ANDROID_USER_HOME,$env:ANDROID_AVD_HOME -Force | Out-Null
