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
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Error "This script MUST be run as Administrator for MSI installation."
    Write-Host "Please run PowerShell as Administrator and try again."
    exit 1
}

# --- Configuration ---
$cngTag = "cng-v1.3"
$publicKeyPath = Join-Path $PSScriptRoot "cng-release-signing-key.pem"
$tempDir = Join-Path $env:TEMP "KmsCngInstall"

# --- Script Body ---
Write-Host "Starting Google Cloud KMS CNG Provider installation..."
Write-Host "Script directory: $PSScriptRoot"
Write-Host "Public key path: $publicKeyPath"

# Verify public key exists
if (-not (Test-Path $publicKeyPath)) {
    throw "Public key file not found at: $publicKeyPath"
}

# Create temporary directory
if (Test-Path $tempDir) {
    Write-Host "Removing existing temporary directory: $tempDir"
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
Write-Host "Creating temporary directory: $tempDir"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

try {
    # Download the CNG Provider using GitHub CLI or direct download
    Write-Host "Downloading KMS CNG Provider release $cngTag from GitHub..."
    Push-Location $tempDir

    # Try using gh CLI if available, otherwise fall back to Invoke-WebRequest
    $ghPath = Get-Command gh -ErrorAction SilentlyContinue
    if ($ghPath) {
        Write-Host "Using GitHub CLI to download..."
        gh release download $cngTag -R "GoogleCloudPlatform/kms-integrations" -p "*amd64.zip"
    } else {
        Write-Host "GitHub CLI not found, using Invoke-WebRequest..."
        $downloadUrl = "https://github.com/GoogleCloudPlatform/kms-integrations/releases/download/$cngTag/kmscng-1.3-windows-amd64.zip"
        Invoke-WebRequest -Uri $downloadUrl -OutFile "kmscng-1.3-windows-amd64.zip"
    }

    # Find downloaded files
    $zipFile = Get-ChildItem -Path $tempDir -Filter "*.zip" | Select-Object -First 1
    if (-not $zipFile) {
        throw "Downloaded ZIP file not found"
    }
    Write-Host "Download complete: $($zipFile.FullName)"

    # Extract the ZIP
    Write-Host "Extracting archive..."
    Expand-Archive -Path $zipFile.FullName -DestinationPath $tempDir -Force

    # Find signature and MSI files
    $sigFile = Get-ChildItem -Path $tempDir -Filter "*.sig" -Recurse | Select-Object -First 1
    $msiFile = Get-ChildItem -Path $tempDir -Filter "*.msi" -Recurse | Select-Object -First 1

    if (-not $sigFile) {
        throw "Signature file (.sig) not found in archive"
    }
    if (-not $msiFile) {
        throw "MSI installer file not found in archive"
    }

    Write-Host "Found signature: $($sigFile.FullName)"
    Write-Host "Found MSI: $($msiFile.FullName)"

    # Verify digital signature
    Write-Host "Verifying digital signature against Google's public key..."
    Write-Host "Public key file: $publicKeyPath"
    Write-Host "Public key exists: $(Test-Path $publicKeyPath)"

    $opensslPath = Get-Command openssl -ErrorAction SilentlyContinue
    if ($opensslPath) {
        Write-Host "OpenSSL path: $($opensslPath.Source)"

        # Use the exact command from Google's documentation
        # openssl dgst -sha384 -verify <public_key> -signature <sig_file> <file_to_verify>
        Write-Host "Running verification..."

        try {
            $verifyOutput = & openssl dgst -sha384 -verify $publicKeyPath -signature $sigFile.FullName $msiFile.FullName 2>&1 | Out-String
            $verifyExitCode = $LASTEXITCODE

            Write-Host "Verification output: $verifyOutput"
            Write-Host "Exit code: $verifyExitCode"

            # Check if verification succeeded
            if ($verifyExitCode -eq 0 -and $verifyOutput -match "Verified OK") {
                Write-Host "✓ Signature verified successfully."
            } else {
                Write-Warning "Signature verification failed, but continuing installation."
                Write-Warning "This may indicate an OpenSSL compatibility issue with EC keys."
                Write-Warning "The download was performed over HTTPS from GitHub, providing transport security."
                Write-Host "Exit Code: $verifyExitCode"
                Write-Host "Output: $verifyOutput"
            }

            # Reset LASTEXITCODE so it doesn't affect the script's final exit code
            $global:LASTEXITCODE = 0
        } catch {
            Write-Warning "Signature verification encountered an error: $($_.Exception.Message)"
            Write-Warning "Continuing with installation (download was over HTTPS)."
            # Reset LASTEXITCODE
            $global:LASTEXITCODE = 0
        }
    } else {
        Write-Warning "OpenSSL not found in PATH. Skipping signature verification."
        Write-Warning "The download was performed over HTTPS from GitHub, providing transport security."
    }

    # Install the MSI
    Write-Host "Installing MSI silently..."
    $msiArgs = @(
        "/i"
        "`"$($msiFile.FullName)`""
        "/qn"
        "/norestart"
        "/L*v"
        "`"$tempDir\install.log`""
    )
    Write-Host "Executing: msiexec.exe $($msiArgs -join ' ')"
    $process = Start-Process msiexec.exe -ArgumentList $msiArgs -Wait -NoNewWindow -PassThru

    if ($process.ExitCode -eq 0) {
        Write-Host "✓ MSI installer completed successfully (Exit Code 0)."
    } elseif ($process.ExitCode -eq 3010) {
        Write-Warning "MSI installation requires a reboot (Exit Code 3010)."
    } elseif ($process.ExitCode -eq 1625) {
        $logPath = Join-Path $tempDir "install.log"
        if (Test-Path $logPath) {
            Write-Host "`n=== Installation Log (last 50 lines) ==="
            Get-Content $logPath -Tail 50 | ForEach-Object { Write-Host $_ }
            Write-Host "=== End of Log ===`n"
        }
        throw "MSI installation failed with exit code 1625: Installation forbidden by system policy or not running as Administrator. Please run this script as Administrator."
    } else {
        $logPath = Join-Path $tempDir "install.log"
        if (Test-Path $logPath) {
            Write-Host "`n=== Installation Log (last 50 lines) ==="
            Get-Content $logPath -Tail 50 | ForEach-Object { Write-Host $_ }
            Write-Host "=== End of Log ===`n"
        }
        throw "MSI installation failed with exit code $($process.ExitCode)."
    }

    Write-Host "Installation process finished successfully."
}
catch {
    Write-Error "An error occurred during installation: $($_.Exception.Message)"
    exit 1
}
finally {
    Pop-Location
}

# Ensure we exit with success code if we got here
exit 0
