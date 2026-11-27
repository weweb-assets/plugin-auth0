// Set WEWEB_SPA_CLIENT_ID in this Action's settings for the intended WeWeb application.
exports.onExecutePostLogin = async (event, api) => {
    const clientId = event.secrets.WEWEB_SPA_CLIENT_ID;
    if (!clientId || event.client.client_id !== clientId) return;

    const metadata = event.user.user_metadata;
    const roles = event.authorization?.roles;
    for (const token of [api.idToken, api.accessToken]) {
        if (metadata) token.setCustomClaim('https://auth0.weweb.io/metadata', metadata);
        if (event.user.email && event.user.email_verified === true && Array.isArray(roles)) {
            token.setCustomClaim('https://auth0.weweb.io/roles', roles);
        }
    }
};
