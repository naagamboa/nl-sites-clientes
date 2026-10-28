param(
  [string]$Url,
  [string]$Out = "shot.png",
  [int]$Width = 1440,
  [int]$Height = 900,
  [int]$Budget = 8000
)

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chrome)) {
  $chrome = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
}

$outPath = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $Out))
$outDir = Split-Path -Parent $outPath
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
if (Test-Path $outPath) { Remove-Item $outPath -Force }

$temp = Join-Path $env:LOCALAPPDATA "nlshot"
if (-not (Test-Path $temp)) { New-Item -ItemType Directory -Path $temp | Out-Null }

& $chrome `
  --headless=new `
  --disable-gpu `
  --hide-scrollbars `
  --force-device-scale-factor=1 `
  --window-size="$Width,$Height" `
  --virtual-time-budget=$Budget `
  --user-data-dir="$temp" `
  --screenshot="$outPath" `
  $Url 2>$null | Out-Null

if (Test-Path $outPath) {
  $item = Get-Item $outPath
  Write-Output ("OK " + $item.FullName + " " + $item.Length + " bytes")
} else {
  Write-Error "Screenshot failed: $outPath"
}
