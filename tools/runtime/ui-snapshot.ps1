param([string]$Name = 'current')
. (Join-Path $PSScriptRoot 'environment.ps1')
& $WholphinAdb -s emulator-5560 shell uiautomator dump /sdcard/wholphin-ui.xml | Out-Null
& $WholphinAdb -s emulator-5560 pull /sdcard/wholphin-ui.xml (Join-Path $WholphinRuntime 'wholphin-ui.xml') 2>$null | Out-Null
[xml]$WholphinUi = Get-Content -LiteralPath (Join-Path $WholphinRuntime 'wholphin-ui.xml') -Raw
$WholphinFocus = @($WholphinUi.SelectNodes('//node[@focused="true"]') | ForEach-Object {
    [PSCustomObject]@{Text=$_.text;Bounds=$_.bounds;Children=@($_.SelectNodes('.//node[@text!=""]') | ForEach-Object { $_.text });Descriptions=@($_.SelectNodes('.//node[@content-desc!=""]') | ForEach-Object { $_.'content-desc' })}
})
$WholphinLabels = @($WholphinUi.SelectNodes('//node[@text!="" or @content-desc!=""]') | ForEach-Object {
    [PSCustomObject]@{Text=if ($_.text) {$_.text} else {$_.'content-desc'};Bounds=$_.bounds;Focused=$_.focused}
})
& $WholphinAdb -s emulator-5560 shell screencap -p /sdcard/wholphin-snapshot.png
& $WholphinAdb -s emulator-5560 pull /sdcard/wholphin-snapshot.png (Join-Path $WholphinRuntime "$Name.png") 2>$null | Out-Null
[PSCustomObject]@{Name=$Name;Focus=$WholphinFocus;Labels=$WholphinLabels} | ConvertTo-Json -Depth 5
