# Builds the site and packs dist/ into a zip ready for cPanel's File Manager.
# Usage (from the project folder): .\scripts\package-hostgator.ps1
#
# Not using Compress-Archive: on Windows PowerShell 5.1 it stores paths with
# backslashes ("assets\index.js"), which the HostGator (Linux) extractor turns
# into files with a backslash in the name instead of folders.

$ErrorActionPreference = 'Stop'
$projeto = Split-Path -Parent $PSScriptRoot
Set-Location $projeto

if (git status --porcelain) {
  throw 'Há alterações não salvas (git status). Faça commit antes de gerar o pacote.'
}

bun run build
if ($LASTEXITCODE -ne 0) { throw 'O build falhou.' }

$dist = Join-Path $projeto 'dist'
if (Test-Path (Join-Path $dist 'config.php')) {
  throw 'dist/config.php existe: segredos não podem ir no pacote.'
}
foreach ($obrigatorio in @('.htaccess', 'index.html', 'contact.php')) {
  if (-not (Test-Path (Join-Path $dist $obrigatorio))) { throw "Falta $obrigatorio no dist/." }
}

$saida = Join-Path (Split-Path -Parent $projeto) 'deploy'
New-Item -ItemType Directory -Force $saida | Out-Null
$codigo = (git rev-parse --short HEAD).Trim()
$zip = Join-Path $saida "ibto-homolog-$codigo.zip"
if (Test-Path $zip) { Remove-Item $zip }

Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
$arquivo = [System.IO.Compression.ZipFile]::Open($zip, 'Create')
try {
  Get-ChildItem $dist -Recurse -File -Force | ForEach-Object {
    $relativo = $_.FullName.Substring($dist.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $arquivo, $_.FullName, $relativo, 'Optimal') | Out-Null
  }
} finally {
  $arquivo.Dispose()
}

$total = (Get-ChildItem $dist -Recurse -File -Force).Count
Write-Output "Pacote gerado: $zip ($total arquivos, versão $codigo)"
