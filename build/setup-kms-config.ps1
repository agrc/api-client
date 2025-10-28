# This script creates the KMS CNG Provider configuration file
# that maps GCP KMS keys for code signing. It MUST be run as Administrator.

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Error "This script must be run as Administrator."
    exit 1
}

param(
    [Parameter(Mandatory=$true)]
    [string]$KmsKeyPath
)

if (-not $KmsKeyPath) {
    Write-Error "KmsKeyPath parameter must be set"
    exit 1
}

# The provider MSI installs to a system-wide context, so we must write the
# config to the system-wide directory.
$configDir = "C:\Windows\KMSCNG"
if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
}

$configFile = Join-Path $configDir "config.yaml"

# Create YAML configuration
$yamlContent = @"
---
resources:
  - crypto_key_version: "$KmsKeyPath"
"@

Write-Host "Creating KMS CNG Provider configuration at $configFile"

$yamlContent | Out-File -FilePath $configFile -Encoding UTF8 -Force

Write-Host "✓ Configuration file created successfully"
