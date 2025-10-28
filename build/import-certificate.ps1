<#
.SYNOPSIS
Imports the code signing certificate to the Windows certificate store.

.DESCRIPTION
This script imports the certificate file (.cer) to the LocalMachine\My certificate store,
which is required for code signing.

.NOTES
- Requires Administrator privileges for certificate import to LocalMachine
- The certificate file should be in CER format
#>

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Error "This script MUST be run as Administrator for certificate import."
    Write-Host "Please run PowerShell as Administrator and try again."
    exit 1
}

# --- Configuration ---
$certPath = Join-Path $PSScriptRoot "cert\windows.cer"

# --- Script Body ---
Write-Host "Starting code signing certificate import..."

if (-not (Test-Path $certPath)) {
    Write-Error "Code signing certificate not found at: $certPath"
    exit 1
}

Write-Host "Certificate path: $certPath"

try {
    # Import the certificate to LocalMachine\My
    Write-Host "Importing certificate to LocalMachine\My..."
    $cert = Import-Certificate -FilePath $certPath -CertStoreLocation Cert:\LocalMachine\My -ErrorAction Stop
    Write-Host "✓ Certificate imported successfully"

    Write-Host "`n✓ Certificate details:"
    Write-Host "  Subject: $($cert.Subject)"
    Write-Host "  Thumbprint: $($cert.Thumbprint)"
    Write-Host "  Valid from: $($cert.NotBefore)"
    Write-Host "  Valid to: $($cert.NotAfter)"

    $foundCert = Get-ChildItem Cert:\LocalMachine\My | Where-Object { $_.Thumbprint -eq $cert.Thumbprint }
    if ($foundCert) {
        Write-Host "✓ Certificate found in store and accessible"
    } else {
        Write-Error "Certificate was imported but cannot be found by thumbprint"
        exit 1
    }

    Write-Host "`n✓ Certificate import completed successfully"
}
catch {
    Write-Error "An error occurred during certificate import: $($_.Exception.Message)"
    exit 1
}

exit 0
