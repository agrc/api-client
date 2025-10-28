# This script creates the KMS CNG Provider configuration file
# that maps GCP KMS keys for code signing

param(
    [Parameter(Mandatory=$false)]
    [string]$KmsKeyPath = $env:GCP_KEY_PATH
)

if (-not $KmsKeyPath) {
    Write-Error "GCP_KEY_PATH environment variable must be set"
    exit 1
}

# Create the config directory if it doesn't exist
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

Write-Host "Creating KMS CNG Provider configuration..."

$yamlContent | Out-File -FilePath $configFile -Encoding UTF8 -Force

Write-Host "✓ Configuration file created successfully"
