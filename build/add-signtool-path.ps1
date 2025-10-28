# Adds a signtool directory to PATH if a modern signtool exists.
# Prefer Windows Kits 11, fall back to 10. Detect /ksp support and write WINDOWS_SIGN_USE_KSP to $env:GITHUB_ENV.

$ErrorActionPreference = 'Continue'

function Add-SigntoolPathIfPresent($baseDir) {
  if (-not (Test-Path $baseDir)) { return $null }
  $versions = Get-ChildItem $baseDir -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending
  foreach ($v in $versions) {
    $candidate = Join-Path $baseDir "${v.Name}\x64"
    $signtoolExe = Join-Path $candidate 'signtool.exe'
    if (Test-Path $signtoolExe) {
      Write-Host "Found signtool at: $signtoolExe"
      Write-Host "Adding $candidate to PATH"
      "PATH=$candidate;$env:PATH" | Out-File -FilePath $env:GITHUB_ENV -Encoding utf8 -Append
      return $signtoolExe
    }
  }
  return $null
}

$found = Add-SigntoolPathIfPresent 'C:\Program Files (x86)\Windows Kits\11\bin'
if (-not $found) {
  Write-Warning 'Windows Kits 11 not found or no signtool present; trying Windows Kits 10...'
  $found = Add-SigntoolPathIfPresent 'C:\Program Files (x86)\Windows Kits\10\bin'
}
if (-not $found) {
  Write-Warning 'No signtool.exe found in Windows Kits paths; will rely on system PATH (may not support /ksp).'
  # Explicitly set env flag to false so downstream steps know we're in CSP fallback mode
  'WINDOWS_SIGN_USE_KSP=false' | Out-File -FilePath $env:GITHUB_ENV -Encoding utf8 -Append
} else {
  try {
    $help = & $found -? 2>&1 | Out-String
    if ($help -match '/ksp') {
      'WINDOWS_SIGN_USE_KSP=true' | Out-File -FilePath $env:GITHUB_ENV -Encoding utf8 -Append
      Write-Host 'signtool supports /ksp; will use KSP mode'
    } else {
      'WINDOWS_SIGN_USE_KSP=false' | Out-File -FilePath $env:GITHUB_ENV -Encoding utf8 -Append
      Write-Warning 'signtool does not advertise /ksp; fallback to CSP mode'
    }
  } catch {
    Write-Warning "Failed to probe signtool help: $_"
    'WINDOWS_SIGN_USE_KSP=false' | Out-File -FilePath $env:GITHUB_ENV -Encoding utf8 -Append
  }
}
