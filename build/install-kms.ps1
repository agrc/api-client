#Requires -RunAsAdministrator

<#
.SYNOPSIS
Downloads, verifies, extracts, and installs the Google Cloud KMS CNG Provider MSI.

.DESCRIPTION
This script performs the following actions:
1. Defines the download URL and expected SHA256 hash for the CNG provider zip file.
2. Creates a temporary directory for the download and extraction.
3. Downloads the zip file using Invoke-WebRequest.
4. Verifies the SHA256 checksum of the downloaded file.
5. Extracts the contents of the zip file.
6. Locates the .msi installer file within the extracted contents.
7. Executes the .msi installer silently using msiexec.exe.
8. Cleans up the temporary download directory.

.NOTES
- This script MUST be run with Administrator privileges due to MSI installation requirements.
- Ensure you have internet connectivity to download the provider.
- Update the $kmsUrl and $expectedHash variables if a newer version is released.
#>

# --- Configuration ---
$kmsUrl = "https://github.com/GoogleCloudPlatform/kms-integrations/releases/download/cng-v1.3/kmscng-1.3-windows-amd64.zip"
$expectedHash = "4cb9fbf6f17f58ca1b404bf532c2d75519f5b3378f646b9c3ac4361e640f2450"
$tempDir = Join-Path $env:TEMP "KmsCngInstall"
$zipFile = Join-Path $tempDir "kmscng.zip"
$extractDir = Join-Path $tempDir "kmscng_extracted" # Changed destination folder name slightly

# --- Script Body ---
Write-Host "Starting Google Cloud KMS CNG Provider installation..."

# Create temporary directory
if (Test-Path $tempDir) {
    Write-Host "Removing existing temporary directory: $tempDir"
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
Write-Host "Creating temporary directory: $tempDir"
New-Item -ItemType Directory -Force -Path $tempDir

try {
    # Download the CNG Provider
    Write-Host "Downloading KMS CNG Provider from $kmsUrl..."
    Invoke-WebRequest -Uri $kmsUrl -OutFile $zipFile
    Write-Host "Download complete: $zipFile"

    # Verify Checksum
    Write-Host "Verifying checksum..."
    $actualHash = (Get-FileHash $zipFile -Algorithm SHA256).Hash.ToLower()
    if ($actualHash -ne $expectedHash.ToLower()) {
        Write-Error "Checksum verification FAILED! Expected $expectedHash, got $actualHash."
        throw "Checksum mismatch."
    }
    Write-Host "Checksum verified successfully."

    # Extract the archive
    Write-Host "Extracting archive to $extractDir..."
    Expand-Archive -Path $zipFile -DestinationPath $extractDir -Force
    Write-Host "Extraction complete."

    # Find the MSI file
    Write-Host "Locating MSI installer..."
    $msiFile = Get-ChildItem -Path $extractDir -Filter "*.msi" -Recurse | Select-Object -First 1
    if (-not $msiFile) {
        throw "MSI installer file not found in extracted archive at $extractDir"
    }
    Write-Host "Found MSI installer: $($msiFile.FullName)"

    # Install the MSI silently
    Write-Host "Running MSI installer silently..."
    $msiArgs = @(
        "/i", "`"$($msiFile.FullName)`"", # Specify the installer file
        "/qn",                             # Quiet mode, no UI
        "/norestart",                      # Do not force restart
        "/L*v", "`"$($tempDir)\kms_cng_install.log`"" # Optional: Verbose logging
    )
    Write-Host "Executing: msiexec.exe $($msiArgs -join ' ')"
    Start-Process msiexec.exe -ArgumentList $msiArgs -Wait -NoNewWindow

    # Check Exit Code (Optional but recommended)
    if ($LASTEXITCODE -ne 0) {
       Write-Warning "MSI installer exited with code $LASTEXITCODE. Check install log: $($tempDir)\kms_cng_install.log"
       # Depending on the exit code, you might want to throw an error here.
       # Common success codes include 0 and 3010 (reboot required)
       if ($LASTEXITCODE -ne 3010) {
           throw "MSI installation failed with exit code $LASTEXITCODE."
       } else {
           Write-Warning "MSI installation requires a reboot (Exit Code 3010)."
       }
    } else {
        Write-Host "MSI installer completed successfully (Exit Code 0)."
    }

    Write-Host "Installation process finished."

}
catch {
    Write-Error "An error occurred during installation: $($_.Exception.Message)"
    exit 1
}

Write-Host "Script finished."
