param(
  [int]$Port = 4173,
  [string]$Root = ""
)

$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrWhiteSpace($Root)) {
  $Root = Split-Path -Parent $PSScriptRoot
}
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()
Write-Output "Serving $Root on http://127.0.0.1:$Port/"

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.webp' = 'image/webp'
  '.woff2'= 'font/woff2'
  '.ico'  = 'image/x-icon'
  '.md'   = 'text/markdown; charset=utf-8'
  '.pdf'  = 'application/pdf'
}

while ($listener.IsListening) {
  try {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)
    if ($path -eq '/') { $path = '/index.html' }
    $local = Join-Path $Root $path.TrimStart('/').Replace('/', '\')

    if ((Test-Path $local -PathType Container)) {
      $local = Join-Path $local 'index.html'
    }

    $fullRoot = [System.IO.Path]::GetFullPath($Root)
    $fullLocal = [System.IO.Path]::GetFullPath($local)
    if (-not $fullLocal.StartsWith($fullRoot, [System.StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $local -PathType Leaf)) {
      $response.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes('404 - Arquivo não encontrado')
      $response.ContentType = 'text/plain; charset=utf-8'
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
      $response.Close()
      continue
    }

    $ext = [System.IO.Path]::GetExtension($local).ToLowerInvariant()
    $response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
    $response.Headers.Add('Cache-Control', 'no-store')
    $bytes = [System.IO.File]::ReadAllBytes($local)
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
    $response.Close()
  } catch {
    try { $response.StatusCode = 500; $response.Close() } catch { }
  }
}
