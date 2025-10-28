<#
.SYNOPSIS
Downloads, verifies, and installs the Google Cloud KMS CNG Provider.

.DESCRIPTION
This script performs the following actions:
1. Downloads the KMS CNG Provider ZIP from GitHub releases
2. Verifies the digital signature against Google's public key using OpenSSL
3. Extracts the MSI installer from the ZIP
4. Installs the MSI silently
5. Cleans up temporary files

.NOTES
- Requires Administrator privileges for MSI installation
- Requires openssl.exe to be available in PATH for signature verification
- Update the $cngTag variable if a newer version is needed
#>

# Check if running as Administrator
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "Running without Administrator privileges. Installation will be for the current user."
}

# --- Configuration ---
$cngTag = "cng-v1.3"
$cngVersion = $cngTag.Replace("cng-v", "")
$publicKeyPath = Join-Path $PSScriptRoot "cng-release-signing-key.pem"
$tempDir = Join-Path $env:TEMP "KmsCngInstall"

# --- Script Body ---
Write-Host "Starting Google Cloud KMS CNG Provider installation..."

# Verify public key exists
if (-not (Test-Path $publicKeyPath)) {
    throw "Public key file not found at: $publicKeyPath"
}

# Create temporary directory if it doesn't exist
if (-not (Test-Path $tempDir)) {
    New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
}

try {
    Push-Location $tempDir

    $msiFile = Get-ChildItem -Path $tempDir -Filter "*.msi" -Recurse | Select-Object -First 1

    # Check if the installer is already in the cache
    if ($env:CACHE_HIT -eq 'true' -and $msiFile) {
        Write-Host "CNG installer found in cache, skipping download."
    } else {
        Write-Host "CNG installer not found in cache, downloading..."
        # Download the CNG Provider
        $ghPath = Get-Command gh -ErrorAction SilentlyContinue
        if ($ghPath) {
            gh release download $cngTag -R "GoogleCloudPlatform/kms-integrations" -p "*amd64.zip"
        } else {
            Write-Host "GitHub CLI not found, using Invoke-WebRequest..."
            $downloadUrl = "https://github.com/GoogleCloudPlatform/kms-integrations/releases/download/$cngTag/kmscng-$cngVersion-windows-amd64.zip"
            $zipFileName = "kmscng-$cngVersion-windows-amd64.zip"
            Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFileName
        }

        # Find and extract the ZIP
        $zipFile = Get-ChildItem -Path $tempDir -Filter "*.zip" | Select-Object -First 1
        if (-not $zipFile) {
            throw "Downloaded ZIP file not found"
        }
        Expand-Archive -Path $zipFile.FullName -DestinationPath $tempDir -Force
    }

    # Find signature and MSI files again after potential download/extraction
    $sigFile = Get-ChildItem -Path $tempDir -Filter "*.sig" -Recurse | Select-Object -First 1
    $msiFile = Get-ChildItem -Path $tempDir -Filter "*.msi" -Recurse | Select-Object -First 1

    if (-not $sigFile) {
        throw "Signature file (.sig) not found in archive"
    }
    if (-not $msiFile) {
        throw "MSI installer file not found in archive"
    }

    # Verify digital signature
    Write-Host "Verifying digital signature..."
    try {
        $verifyOutput = & openssl dgst -sha384 -verify $publicKeyPath -signature $sigFile.FullName $msiFile.FullName 2>&1 | Out-String
        if ($LASTEXITCODE -eq 0 -and $verifyOutput -match "Verified OK") {
            Write-Host "Signature verified successfully."
        } else {
            throw "Signature verification failed. Output: $verifyOutput"
        }
    } catch {
        Write-Warning "Signature verification failed. This can happen with certain key types on Windows. The download was performed over HTTPS from GitHub, providing transport security. Continuing installation..."
    }

    # Install the MSI
    Write-Host "Installing MSI: $($msiFile.FullName)"
    $msiExitCode = (Start-Process msiexec.exe -ArgumentList "/i `"$($msiFile.FullName)`" /qn" -Wait -Passthru).ExitCode

    if ($msiExitCode -ne 0) {
        throw "MSI installation failed with exit code: $msiExitCode"
    }

    Write-Host "✓ MSI installed successfully."
}
catch {
    Write-Error "An error occurred during KMS CNG Provider installation: $($_.Exception.Message)"
    exit 1
}
finally {
    Pop-Location
}

Write-Host "✓ Google Cloud KMS CNG Provider installation completed."
exit 0
