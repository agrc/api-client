# This script creates the KMS CNG Provider configuration file
# that maps certificate thumbprints to GCP KMS keys

param(
    [Parameter(Mandatory=$false)]
    [string]$CertThumbprint = $env:CERTIFICATE_SHA1,

    [Parameter(Mandatory=$false)]
    [string]$KmsKeyPath = $env:GCP_KEY_PATH
)

if (-not $CertThumbprint -or -not $KmsKeyPath) {
    Write-Error "CERTIFICATE_SHA1 and GCP_KEY_PATH environment variables must be set"
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
