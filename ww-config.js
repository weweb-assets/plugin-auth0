export default {
    editor: {
        settings: [
            {
                label: 'Set-up Single Page Application',
                icon: 'advanced',
                edit: () => import('./src/components/SinglePageApp/SettingsEdit.vue'),
                summary: () => import('./src/components/SinglePageApp/SettingsSummary.vue'),
                getIsValid(settings) {
                    const { domain, SPAClientId } = settings.publicData;
                    const { SPAClientSecret } = settings.privateData;
                    return !!domain && !!SPAClientId && !!SPAClientSecret;
                },
            },
            {
                label: 'Set-up Machine to Machine Application',
                icon: 'advanced',
                edit: () => import('./src/components/MachineToMachine/SettingsEdit.vue'),
                summary: () => import('./src/components/MachineToMachine/SettingsSummary.vue'),
                getIsValid(settings) {
                    const { domain, M2MClientId } = settings.publicData;
                    const { M2MClientSecret } = settings.privateData;
                    return !!domain && !!M2MClientId && !!M2MClientSecret;
                },
            },
            {
                label: 'Define rediretions (URLs)',
                icon: 'open-out',
                edit: () => import('./src/components/Redirections/SettingsEdit.vue'),
                summary: () => import('./src/components/Redirections/SettingsSummary.vue'),
                getIsValid(settings) {
                    const { afterSignInPageId, afterNotSignInPageId } = settings.publicData;
                    return !!afterSignInPageId && !!afterNotSignInPageId;
                },
            },
            {
                label: 'Set-up Auth0 Application URIs',
                icon: 'auth0',
                edit: () => import('./src/components/Auth0/SettingsSummary.vue'),
                summary: () => import('./src/components/Auth0/SettingsSummary.vue'),
                getIsValid() {
                    return true;
                },
            },
        ],
        designSystemId: 'ec2eebfe-499b-43c4-b260-80ee5a4d9504',
    },
    variables: [
        { name: 'user', value: 'user', type: 'object' },
        { name: 'isAuthenticated', value: 'isAuthenticated', type: 'boolean' },
    ],
    functions: [
        { name: 'Login with Popup', code: 'loginWithPopup', parameters: [], isAsync: true },
        { name: 'Login with Redirect', code: 'loginWithRedirect', parameters: [] },
        { name: 'Logout', code: 'logout', parameters: [] },
    ],
};
