# UGRC API Client

## Deployment Pipeline Setup

1. Export the developer id application certificate as a p12 via keychain -> export.
1. Store the password and the base64-encoded as:

   - `gh secret set CERTIFICATES_P12 -b$(base64 -i ~/Certificates.p12) --env=prod`
   - `gh secret set CERTIFICATES_P12_PASSWORD -b<password> --env=prod`

1. Add the rest of the environment variables as secrets:
   - `APPLE_IDENTITY`
   - `APPLE_BUNDLE_ID`
   - `APPLE_USER_ID`
   - `APPLE_PASSWORD`

## Cutting a New Release

From a branch:

1. `npm version (major | minor | patch) -m "release: %s"`
1. `npm run publish`
1. Finish [draft release](https://github.com/agrc/api-client/releases)
