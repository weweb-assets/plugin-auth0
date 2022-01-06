export default {
    editor: {
        settings: [
            {
                label: 'Configuration',
                icon: 'advanced',
                edit: () => import('./src/components/Configuration/SettingsEdit.vue'),
                summary: () => import('./src/components/Configuration/SettingsSummary.vue'),
                getIsValid(settings) {
                    const { domain, SPAClientId, M2MClientId } = settings.publicData;
                    const { SPAClientSecret, M2MClientSecret } = settings.privateData;
                    return !!domain && !!SPAClientId && !!SPAClientSecret && !!M2MClientId && !!M2MClientSecret;
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
        ],
        designSystemId: 'ec2eebfe-499b-43c4-b260-80ee5a4d9504',
    },
    variables: [
        { name: 'user', value: 'user', type: 'object', defaultValue: null },
        { name: 'isAuthenticated', value: 'isAuthenticated', type: 'boolean', defaultValue: false },
    ],
    functions: [
        {
            name: 'Login with Popup',
            code: 'loginWithPopup',
            parameters: [{ name: 'screenHint', type: 'string' }],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Login.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Login with Redirect',
            code: 'loginWithRedirect',
            parameters: [{ name: 'screenHint', type: 'string' }],
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Login.vue'),
            /* wwEditor:end */
        },
        { name: 'Logout', code: 'logout', parameters: [] },
        {
            name: 'Update User Profile',
            code: 'updateUserProfile',
            parameters: [
                { name: 'Family name', type: 'string' },
                { name: 'Given name', type: 'string' },
                { name: 'Nickname', type: 'string' },
                { name: 'Username', type: 'string' },
                { name: 'Name', type: 'string' },
                { name: 'Picture', type: 'string' },
                { name: 'Metadata', type: 'object' },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/UpdateUserProfile.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Update User Email',
            code: 'updateUserEmail',
            parameters: [{ name: 'Email', type: 'string' }],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/UpdateUserEmail.vue'),
            getIsValid([email]) {
                return !!email;
            },
            /* wwEditor:end */
        },
        {
            name: 'Chnage User Password',
            code: 'changeUserPassword',
            parameters: [
                { name: 'Database', type: 'string' },
                { name: 'Email', type: 'string' },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/ChangeUserPassword.vue'),
            getIsValid([connection, email]) {
                return !!connection && !!email;
            },
            /* wwEditor:end */
        },
    ],
};
