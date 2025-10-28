<#
.SYNOPSIS
Imports the code signing certificate and links it to the Google Cloud KMS key.

.DESCRIPTION
This script performs two critical actions:
1. Imports the public certificate to the current user's certificate store.
2. Uses certutil to associate that certificate with the private key in KMS,
   enabling signtool.exe to find and use it.

.NOTES
- The CertSha1 parameter is required.
#>
param(
    [Parameter(Mandatory=$true)]
    [string]$CertSha1
)

# --- Configuration ---
$certPath = Join-Path $PSScriptRoot "cert\windows.cer"

# --- Script Body ---
Write-Host "Starting code signing certificate import..."

if (-not (Test-Path $certPath)) {
    Write-Error "Code signing certificate not found at: $certPath"
    exit 1
}

Write-Host "Certificate path: $certPath"
Write-Host "Certificate SHA1: $CertSha1"

try {
    # Import the certificate to the CurrentUser's 'My' store. This is more reliable
    # in CI environments than using certutil for adding.
    $cert = Import-Certificate -FilePath $certPath -CertStoreLocation Cert:\CurrentUser\My -ErrorAction Stop
    Write-Host "✓ Certificate imported successfully to CurrentUser store."

    # Attempt to associate the certificate with the KMS key container explicitly to help
    # Windows correlate the certificate with the external key handle. Use correct argument
    # order: ProviderName first, then KeyContainerName.
    $ring = ($env:GCP_KEYRING_PATH || '').Trim()
    $keyName = ($env:GCP_KEY_NAME || 'default').Trim()
    if ([string]::IsNullOrWhiteSpace($ring)) {
        Write-Warning "GCP_KEYRING_PATH environment variable is not set; skipping repairstore."
    }
    else {
        # Normalize to gkms:// scheme for the KMS provider if not already
        if ($kmsKeyPath -notmatch '^gkms://') {
            $kmsKeyPath = 'gkms://' + ($kmsKeyPath.TrimStart('/'))
        }
        Write-Host "Linking certificate to KMS key container..."
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = 'certutil.exe'
        # certutil -user -repairstore my <SHA1> "Google Cloud KMS Provider" "<KeyContainer>"
        $psi.Arguments = "-user -repairstore my $CertSha1 `"Google Cloud KMS Provider`" `"$kmsKeyPath`""
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError = $true
        $psi.UseShellExecute = $false
        $p = [System.Diagnostics.Process]::Start($psi)
        $p.WaitForExit()
        if ($p.ExitCode -ne 0) {
            Write-Warning "certutil -repairstore failed with exit code $($p.ExitCode). Proceeding without persistent association."
        }
        else {
            Write-Host "✓ Certificate linked to KMS key container."
        }
    }

    # Verify the certificate can be found by its thumbprint.
    $foundCert = Get-ChildItem Cert:\CurrentUser\My | Where-Object { $_.Thumbprint -eq $CertSha1 }
    if ($foundCert) {
        Write-Host "✓ Certificate found in store and is accessible."
    } else {
        Write-Error "FATAL: Certificate was imported but cannot be found by thumbprint."
        exit 1
    }
}
catch {
    Write-Error "An error occurred during certificate import or linking: $($_.Exception.Message)"
    exit 1
}

exit 0
