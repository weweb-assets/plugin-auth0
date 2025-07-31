export default {
    features: {
        auth: true,
    },
    /* wwEditor:start */
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
        ],
        designSystemId: 'ec2eebfe-499b-43c4-b260-80ee5a4d9504',
    },
    /* wwEditor:end */
    variables: [
        { name: 'user', value: 'user', type: 'object', defaultValue: null },
        { name: 'accessToken', value: 'token', type: 'accessToken', defaultValue: null },
        { name: 'isAuthenticated', value: 'isAuthenticated', type: 'boolean', defaultValue: false },
    ],
    actions: [
        {
            name: 'Login with Popup',
            code: 'loginWithPopup',
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Login.vue'),
            copilot: {
                description: "Opens a popup window for Auth0 authentication",
                returns: "void",
                schema: {
                    screenHint: {
                        type: "string",
                        description: "Determines whether to show login or signup screen",
                        bindable: false
                    },
                    organization: {
                        type: "string",
                        description: "Organization ID for enterprise authentication",
                        bindable: true
                    }
                }
            }
            /* wwEditor:end */
        },
        {
            name: 'Login with Redirect',
            code: 'loginWithRedirect',
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Login.vue'),
            copilot: {
                description: "Redirects to Auth0 authentication page",
                returns: "void",
                schema: {
                    screenHint: {
                        type: "string",
                        description: "Determines whether to show login or signup screen",
                        bindable: false
                    },
                    organization: {
                        type: "string",
                        description: "Organization ID for enterprise authentication",
                        bindable: true
                    }
                }
            }
            /* wwEditor:end */
        },
        { 
            name: 'Logout', 
            code: 'logout',
            /* wwEditor:start */
            copilot: {
                description: "Logs out the current user and clears the session",
                returns: "void",
                schema: {}
            }
            /* wwEditor:end */
        },
        {
            name: 'Update User Profile',
            code: 'updateUserProfile',
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/UpdateUserProfile.vue'),
            copilot: {
                description: "Updates the current user's profile information",
                returns: "void",
                schema: {
                    familyName: {
                        type: "string",
                        description: "User's family name/surname",
                        bindable: true
                    },
                    givenName: {
                        type: "string",
                        description: "User's given/first name",
                        bindable: true
                    },
                    nickname: {
                        type: "string",
                        description: "User's nickname",
                        bindable: true
                    },
                    username: {
                        type: "string",
                        description: "User's username",
                        bindable: true
                    },
                    name: {
                        type: "string",
                        description: "User's full name",
                        bindable: true
                    },
                    picture: {
                        type: "string",
                        description: "URL of user's profile picture",
                        bindable: true
                    },
                    metadata: {
                        type: "array",
                        description: "Array of key-value pairs for custom user metadata",
                        bindable: true
                    }
                }
            }
            /* wwEditor:end */
        },
        {
            name: 'Update User Email',
            code: 'updateUserEmail',
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/UpdateUserEmail.vue'),
            getIsValid({ email }) {
                return !!email;
            },
            copilot: {
                description: "Updates the current user's email address",
                returns: "void",
                schema: {
                    email: {
                        type: "string",
                        description: "New email address for the user",
                        bindable: true
                    }
                }
            }
            /* wwEditor:end */
        },
        {
            name: 'Change User Password',
            code: 'changeUserPassword',
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/ChangeUserPassword.vue'),
            getIsValid({ connection, email }) {
                return !!connection && !!email;
            },
            copilot: {
                description: "Initiates password change process for a user",
                returns: "void",
                schema: {
                    connection: {
                        type: "string",
                        description: "Auth0 database connection name",
                        bindable: false
                    },
                    email: {
                        type: "string",
                        description: "Email address of the user",
                        bindable: true
                    }
                }
            }
            /* wwEditor:end */
        },
    ],
};