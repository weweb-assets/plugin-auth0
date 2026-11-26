# PLUGIN-AUTH0

This is an plugin for [weweb.io](https://www.weweb.io/).

## Installation

To run locally, first install all dependencies with `npm install`.

## Start

To serve locally, run `npm run serve --port=[PORT]`, and then go to Weweb editor, open developper popup and add localhost:[PORT] as custom plugin.

## Build

Before release, you can check build error by running `npm run build --name="plugin-auth0" --type="plugin"`

## Auth0 claims used by the project

The runtime reads the namespaced `roles` and `metadata` claims under `https://auth0.weweb.io/`. Projects that already supply these claims can keep their existing login flow. For a tenant that needs them, the repository includes a Post Login Action that its Auth0 administrator can review. [Action source](examples/weweb-post-login.js)

The Action reads the public application client ID from its `WEWEB_SPA_CLIENT_ID` setting and applies only to that application. It copies the user's existing `user_metadata` into the ID and access tokens, matching the historical plugin contract. A project that stores additional personal data in that object should select the fields its app actually needs before using the Action. The roles claim comes from Auth0 authorization and requires a verified email address. A missing or malformed role claim denies access to role-restricted pages. [Auth0 custom claims](https://support.auth0.com/center/s/article/Set-ID-token-claims-using-actions) · [Auth0 roles](https://support.auth0.com/center/s/article/add-roles-and-permissions-to-the-id-token-using-actions)

On a test tenant, configure the Action for the project's SPA and attach it to the Login flow. Sign in with a verified test user with an assigned role, then with a user without that role. Verify the protected page and the metadata fields used by the project in the isolated preview tab. Check that another SPA in the tenant keeps its existing claims.
