<#
.SYNOPSIS
Imports the code signing certificate to the Windows certificate store.

.DESCRIPTION
This script imports the PKCS#7 (.p7b) certificate file containing the certificate chain
to the LocalMachine\My certificate store, which is required for code signing.

.NOTES
- Requires Administrator privileges for certificate import to LocalMachine
- The certificate file should be a PKCS#7 format containing the full certificate chain
#>

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Error "This script MUST be run as Administrator for certificate import."
    Write-Host "Please run PowerShell as Administrator and try again."
    exit 1
}

# --- Configuration ---
$certPath = Join-Path $PSScriptRoot "cert\windows.p7b"

# --- Script Body ---
Write-Host "Starting code signing certificate import..."

if (-not (Test-Path $certPath)) {
    Write-Error "Code signing certificate not found at: $certPath"
    exit 1
}

Write-Host "Certificate path: $certPath"

try {
    # Import all certificates from the PKCS#7 file to LocalMachine\My
    # The .p7b file contains the full certificate chain
    Write-Host "Importing certificates to LocalMachine\My..."
    $certs = Import-Certificate -FilePath $certPath -CertStoreLocation Cert:\LocalMachine\My -ErrorAction Stop
    Write-Host "✓ Certificate(s) imported successfully"
    Write-Host "  Total certificates imported: $($certs.Count)"

    # Find the signing certificate (the one that matches CERTIFICATE_SHA1)
    $signingCert = $null
    if ($env:CERTIFICATE_SHA1) {
        $targetThumbprint = $env:CERTIFICATE_SHA1.Replace(' ', '').ToUpper()
        Write-Host "`nLooking for signing certificate with thumbprint: $targetThumbprint"

        foreach ($cert in $certs) {
            $subjectCN = ($cert.Subject -split ',')[0]
            Write-Host "  - $subjectCN : $($cert.Thumbprint)"
            if ($cert.Thumbprint.ToUpper() -eq $targetThumbprint) {
                $signingCert = $cert
                Write-Host "    ✓ This is your signing certificate!"
            }
        }

        if ($signingCert) {
            Write-Host "`n✓ Signing certificate found and imported:"
            Write-Host "  Subject: $($signingCert.Subject)"
            Write-Host "  Thumbprint: $($signingCert.Thumbprint)"
            Write-Host "  Valid from: $($signingCert.NotBefore)"
            Write-Host "  Valid to: $($signingCert.NotAfter)"
        } else {
            Write-Warning "Could not find certificate with thumbprint $targetThumbprint"
            Write-Warning "Available thumbprints:"
            foreach ($cert in $certs) {
                Write-Warning "  - $($cert.Thumbprint)"
            }
            exit 1
        }
    } else {
        Write-Warning "CERTIFICATE_SHA1 environment variable not set"
        Write-Host "Imported certificates:"
        foreach ($cert in $certs) {
            Write-Host "  - $($cert.Subject) : $($cert.Thumbprint)"
        }
    }

    # Verify certificate can be found by thumbprint
    if ($signingCert) {
        Write-Host "`nVerifying certificate is accessible..."
        $foundCert = Get-ChildItem Cert:\LocalMachine\My | Where-Object { $_.Thumbprint -eq $signingCert.Thumbprint }
        if ($foundCert) {
            Write-Host "✓ Certificate found in store and accessible"
            Write-Host "  Has private key: $($foundCert.HasPrivateKey)"

            if (-not $foundCert.HasPrivateKey) {
                Write-Host ""
                Write-Host "NOTE: Certificate does not have a private key reference."
                Write-Host "This is expected - the private key is in Google Cloud KMS."
                Write-Host "The KMS CNG Provider will provide access during signing."
            }
        } else {
            Write-Error "Certificate was imported but cannot be found by thumbprint"
            exit 1
        }
    }

    Write-Host "`n✓ Certificate import completed successfully"
}
catch {
    Write-Error "An error occurred during certificate import: $($_.Exception.Message)"
    exit 1
}

exit 0
