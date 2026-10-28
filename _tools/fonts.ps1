param(
  [string]$Name,
  [string]$CssUrl,
  [string]$OutDir
)

$ErrorActionPreference = 'Stop'
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
$fontDir = Join-Path $OutDir 'assets\fonts'
New-Item -ItemType Directory -Force -Path $fontDir | Out-Null
$tmpCss = Join-Path $env:TEMP ("fonts-" + $Name + ".css")
& curl.exe -sS -L -A $ua $CssUrl -o $tmpCss
if ($LASTEXITCODE -ne 0) { throw "Falha ao baixar CSS de fontes para $Name" }
$css = Get-Content -Raw -Path $tmpCss

$blocks = [regex]::Matches($css, '(?s)/\* latin \*/\s*@font-face\s*\{.*?\}')
if ($blocks.Count -eq 0) { throw "Nenhum bloco latin encontrado para $Name" }

$outCss = New-Object System.Text.StringBuilder
[void]$outCss.AppendLine("/* Fontes self-hosted - Google Fonts (subset latin) - geradas em 2026-10-27 */")

$seen = @{}
foreach ($block in $blocks) {
  $text = $block.Value
  $family = [regex]::Match($text, "font-family:\s*'([^']+)'").Groups[1].Value
  $style = [regex]::Match($text, "font-style:\s*([^;]+);").Groups[1].Value.Trim()
  $weight = [regex]::Match($text, "font-weight:\s*([^;]+);").Groups[1].Value.Trim()
  $url = [regex]::Match($text, "url\((https://[^)]+)\)").Groups[1].Value
  if (-not $family -or -not $url) { continue }

  $safeFamily = ($family -replace '[^a-zA-Z0-9]', '')
  $safeWeight = ($weight -replace '[^a-zA-Z0-9]', '-')
  $fileName = "$safeFamily-$style-$safeWeight.woff2"
  $target = Join-Path $fontDir $fileName

  if (-not $seen.ContainsKey($url)) {
    & curl.exe -sS -L -A $ua $url -o $target
    if ($LASTEXITCODE -ne 0) { throw "Falha ao baixar $url" }
    $seen[$url] = $true
    Write-Output "OK $fileName"
  }

  [void]$outCss.AppendLine("@font-face {")
  [void]$outCss.AppendLine("  font-family: '$family';")
  [void]$outCss.AppendLine("  font-style: $style;")
  [void]$outCss.AppendLine("  font-weight: $weight;")
  [void]$outCss.AppendLine("  font-display: swap;")
  [void]$outCss.AppendLine("  src: url('fonts/$fileName') format('woff2');")
  [void]$outCss.AppendLine("  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;")
  [void]$outCss.AppendLine("}")
}

$outCssPath = Join-Path $OutDir 'assets\fonts.css'
[System.IO.File]::WriteAllText($outCssPath, $outCss.ToString(), (New-Object System.Text.UTF8Encoding($false)))
Write-Output "CSS: $outCssPath"
