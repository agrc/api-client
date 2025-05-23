# UGRC API Client

[![Release Events](https://github.com/agrc/api-client/actions/workflows/release.yml/badge.svg)](https://github.com/agrc/api-client/actions/workflows/release.yml)

<img src="https://github.com/agrc/api-client/blob/main/src/assets/logo.svg" width="125px" />

The Utah Geospatial Resource Center (UGRC) is the State of Utah’s map technology coordination office. The UGRC creates, maintains, and stores geospatial data in the State Geographic Information Database (SGID), a one-stop shop to hundreds of data layers developed, aggregated, or acquired by state government. UGRC’s API is an http-enabled service for accessing this valuable geospatial data.

From querying any data layer in the SGID to geocoding addresses against the most accurate statewide roads dataset, the application of the API is endless. The API also powers UGRC’s widgets, toolboxes, and add-ins, which can help you navigate the sea of data in the SGID.

The UGRC API Client is an app to help make geocoding addresses simple. This app allows the user to use the UGRC API without any licensed software or programming knowledge; Drag and drop a file and then click start.

Check out our [introductory blog post](https://gis.utah.gov/blog/2021-11-29-introducing-the-official-ugrc-api-client/) and our [getting started video](https://www.youtube.com/watch?v=BSmQ_9E0cVE).

## Development Specifics

### Certificates

An apple developer certificate is required to sign the application for distribution.

1. Using keychain's certificate assistant, request a certificate from a certificate authority.
   - Leave CA Email address empty
   - Request is `Saved to disk`
1. Provide the certificate request to [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/certificates/add) to create a `Developer ID Certificate`
   - Only the account holder of the Developer Group can create this type of certificate.
1. Import the certificate to keychain and then export it as a p12 file for the deployment pipeline.
   - Store the password required for exporting for the GitHub Actions secrets.

### Deployment pipeline set up

1. Create a `prod` and `dev` GitHub [repo environment](https://github.com/agrc/api-client/settings/environments).
1. Store the password and the p12 certificate as GitHub Action secrets in the environment:

   - `gh secret set APPLE_CERTIFICATE -b$(base64 -i ~/certificate.p12) --env=prod`
   - `gh secret set APPLE_CERTIFICATE_PASSWORD -b<password> --env=prod`
   - `gh secret set WINDOWS_CERTIFICATE_PASSWORD -b<password> --env=prod`

1. Add the rest of the environment variables as secrets:
   - `APPLE_IDENTITY`: _the name of the developer id certificate name as it appears in keychain_
   - `APPLE_TEAM_ID`: _the team id to notarize under viewable on your [Apple Developer Account](https://developer.apple.com/account) "Membership details", page_
   - `APPLE_USER_ID`: _the full email address of your [Apple Developer Account](https://developer.apple.com/account)_
   - `APPLE_PASSWORD`: _the app-specific password (not your Apple ID password) created on https://appleid.apple.com/account/manage_

## Deploying a new version

GitHub Actions will create and update a draft release with every merged pull request. When a release is desired, publish the [draft release](https://github.com/agrc/api-client/releases). Another GitHub action will sign the binaries and upload them to the release assets. The API Clients will silently download the update and the installation will occur on the next restart of the app.
