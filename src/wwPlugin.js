import createAuth0Client from '@auth0/auth0-spa-js';

/* wwEditor:start */
import './components/Redirections/SettingsEdit.vue';
import './components/Redirections/SettingsSummary.vue';
import './components/Configuration/SettingsEdit.vue';
import './components/Configuration/SettingsSummary.vue';
import './components/Login.vue';
import {
    GET_AUTH0_ROLES,
    GET_AUTH0_CLIENTS,
    CREATE_AUTH0_CLIENT,
    UPDATE_AUTH0_CLIENT,
    GET_AUTH0_RULES,
    CREATE_AUTH0_RULE,
} from './graphql';
/* wwEditor:end */

export default {
    /*=============================================m_ÔÔ_m=============================================\
        Plugin API
    \================================================================================================*/
    async onLoad() {
        await this.createClient();
        if (!this.client) return;
        await this.checkRedirectCallback();
        await this.checkIsAuthenticated();
    },
    /*=============================================m_ÔÔ_m=============================================\
        Auth API
    \================================================================================================*/
    /* wwEditor:start */
    async getRoles(isNoCache = false) {
        const { data } = await wwLib.$apollo.query({
            query: GET_AUTH0_ROLES,
            variables: {
                designId: this.settings.designId,
                settingsId: this.settings.id,
            },
            fetchPolicy: isNoCache ? 'network-only' : 'cache-first',
        });
        return data.getAuth0Roles.data.map(role => ({ label: role.description, value: role.id }));
    },
    /* wwEditor:end */
    /*=============================================m_ÔÔ_m=============================================\
        Auth0 API
    \================================================================================================*/
    client: null,
    async createClient() {
        const { domain, SPAClientId: client_id, afterSignInPageId } = this.settings.publicData;
        if (!domain || !client_id) return;

        /* wwEditor:start */
        const website = wwLib.wwWebsiteData.getInfo();
        const page = wwLib.wwWebsiteData.getPages().find(page => page.id === afterSignInPageId);
        const isHomePage = page && page.id === website.homePageId;
        const redirectUriEditor =
            page && !isHomePage
                ? `${window.location.origin}/${website.id}/${page.id}`
                : `${window.location.origin}/${website.id}/`;
        this.client = await createAuth0Client({ domain, client_id, redirect_uri: redirectUriEditor });
        updateClient(this.settings, this.settings.publicData.SPAClientId, getSPAClientRedirection(this.settings));
        checkRules(this.settings);
        /* wwEditor:end */
        /* wwFront:start */
        const pagePath = wwLib.wwPageHelper.getPagePath(afterSignInPageId);
        this.client = await createAuth0Client({
            domain,
            client_id,
            redirect_uri: `${window.location.origin}${pagePath}`,
        });
        /* wwFront:end */
    },
    async checkRedirectCallback() {
        try {
            const router = wwLib.manager ? wwLib.getEditorRouter() : wwLib.getFrontRouter();
            await router.isReady();
            const { code, state } = router.currentRoute.value.query;
            if (code && state) {
                await this.client.handleRedirectCallback();
                await this.setCookieSession();
                this.redirectAfterSignIn();
            }
        } catch (err) {
            wwLib.wwLog.error(err);
        }
    },
    async checkIsAuthenticated() {
        const isAuthenticated = await this.client.isAuthenticated();
        wwLib.wwVariable.updateValue(`${this.id}-isAuthenticated`, isAuthenticated);
        const user = await this.client.getUser();
        wwLib.wwVariable.updateValue(
            `${this.id}-user`,
            user ? JSON.parse(JSON.stringify(user).replace(/https:\/\/auth0.weweb.io\//g, '')) : null
        );
    },
    async loginWithPopup(screen_hint) {
        try {
            await this.client.loginWithPopup({ screen_hint });
            await this.setCookieSession();
            this.redirectAfterSignIn();
        } catch (err) {
            wwLib.wwLog.error(err);
        } finally {
            this.checkIsAuthenticated();
        }
    },
    loginWithRedirect(screen_hint) {
        /* wwFront:start */
        return this.client.loginWithRedirect({ screen_hint });
        /* wwFront:end */
        /* wwEditor:start */
        // eslint-disable-next-line no-unreachable
        return this.loginWithPopup([screen_hint]);
        /* wwEditor:end */
    },
    logout() {
        this.removeCookieSession();
        /* wwEditor:start */
        const website = wwLib.wwWebsiteData.getInfo();
        const page = wwLib.wwWebsiteData
            .getPages()
            .find(page => page.id === this.settings.publicData.afterNotSignInPageId);
        this.client.logout();
        wwLib.getEditorWindow().location = `/${website.id}/${page.id}`;
        /* wwEditor:end */
        /* wwFront:start */
        const pagePath = wwLib.wwPageHelper.getPagePath(this.settings.publicData.afterNotSignInPageId);
        return this.client.logout({ returnTo: `${window.location.origin}${pagePath}` });
        /* wwFront:end */
    },
    removeCookieSession() {
        window.vm.config.globalProperties.$cookie.removeCookie('session');
    },
    async setCookieSession(token = null) {
        const sessionToken = token || (await this.client.getTokenSilently());
        window.vm.config.globalProperties.$cookie.setCookie('session', sessionToken);
    },
    redirectAfterSignIn() {
        /* wwFront:start */
        const pagePath = wwLib.wwPageHelper.getPagePath(this.settings.publicData.afterSignInPageId);
        wwLib.goTo(pagePath);
        /* wwFront:end */
        /* wwEditor:start */
        wwLib.goTo(this.settings.publicData.afterSignInPageId);
        /* wwEditor:end */
    },
};

/* wwEditor:start */
/*=============================================m_ÔÔ_m=============================================\
    Clients
\================================================================================================*/
export const getClients = async (settings, domain, token) => {
    const { data } = await wwLib.$apollo.query({
        query: GET_AUTH0_CLIENTS,
        variables: {
            designId: settings.designId,
            settingsId: settings.id,
            domain,
            token,
        },
        fetchPolicy: 'network-only',
    });
    return data.getAuth0Clients.data;
};

export const createClient = async (settings, clientData, domain, token) => {
    const { data } = await wwLib.$apollo.mutate({
        mutation: CREATE_AUTH0_CLIENT,
        variables: {
            designId: settings.designId,
            settingsId: settings.id,
            domain,
            token,
            data: clientData,
        },
    });
    return data.createAuth0Client.data;
};

export const updateClient = async (settings, clientId, clientData) => {
    const { data } = await wwLib.$apollo.mutate({
        mutation: UPDATE_AUTH0_CLIENT,
        variables: {
            designId: settings.designId,
            settingsId: settings.id,
            clientId,
            data: clientData,
        },
    });
    return data.updateAuth0Client.data;
};

export const getSPAClientRedirection = settings => {
    const customDomain = wwLib.wwWebsiteData.getInfo().names[0];
    const getUrls = pageId => {
        const page = wwLib.wwWebsiteData.getPages().find(page => page.id === pageId);
        if (!page) return [];
        const isHomePageId = page.id === wwLib.wwWebsiteData.getInfo().homePageId;
        const editorUrl = `${window.location.origin}/${settings.designId}/${isHomePageId ? '' : page.id}`;
        const frontUrls = page.langs
            .map(lang => [
                `https://${settings.designId}.${wwLib.wwApiRequests._getPreviewUrl()}${wwLib.wwPageHelper.getPagePath(
                    page.id,
                    lang
                )}`,
                customDomain && `https://${customDomain.name}${wwLib.wwPageHelper.getPagePath(page.id, lang)}`,
            ])
            .flat()
            .filter(item => item);
        return [...frontUrls, editorUrl];
    };
    const origins = [
        `https://${settings.designId}.${wwLib.wwApiRequests._getPreviewUrl()}`,
        customDomain && customDomain.name,
        `${window.location.origin}`,
    ].filter(item => item);
    return {
        callbacks: getUrls(settings.publicData.afterSignInPageId),
        allowed_logout_urls: getUrls(settings.publicData.afterNotSignInPageId),
        allowed_origins: origins,
        web_origins: origins,
    };
};

export const SPA_CLIENT = {
    name: 'WeWeb App',
    app_type: 'spa',
    jwt_configuration: {
        alg: 'RS256',
    },
};

/*=============================================m_ÔÔ_m=============================================\
    Rules
\================================================================================================*/
const getRules = async settings => {
    const { data } = await wwLib.$apollo.query({
        query: GET_AUTH0_RULES,
        variables: {
            designId: settings.designId,
            settingsId: settings.id,
        },
        fetchPolicy: 'network-only',
    });
    return data.getAuth0Rules.data;
};

const createRule = async (settings, ruleData) => {
    const { data } = await wwLib.$apollo.mutate({
        mutation: CREATE_AUTH0_RULE,
        variables: {
            designId: settings.designId,
            settingsId: settings.id,
            data: ruleData,
        },
    });
    return data.createAuth0Rule.data;
};

const checkRules = async settings => {
    const rules = await getRules(settings);
    const isUserRolesRule = rules.some(rule => rule.name === USER_ROLES_RULE.name);
    const isUserMetaRule = rules.some(rule => rule.name === USER_META_RULE.name);
    if (!isUserRolesRule) createRule(settings, USER_ROLES_RULE);
    if (!isUserMetaRule) createRule(settings, USER_META_RULE);
};

const USER_ROLES_RULE = {
    name: 'WeWeb - Enrich user with roles',
    script: `function addRoles(user, context, callback) {
    // Roles should only be set to verified users.
    if (!user.email || !user.email_verified) {
        return callback(null, user, context);
    }

    context.idToken['https://auth0.weweb.io/roles'] = context.authorization.roles;
    context.accessToken['https://auth0.weweb.io/roles'] = context.authorization.roles;

    return callback(null, user, context);
}`,
    enabled: true,
};

const USER_META_RULE = {
    name: 'WeWeb - Enrich user with metadata',
    script: `function addRoles(user, context, callback) {

    context.idToken['https://auth0.weweb.io/metadata'] = user.user_metadata;
    context.accessToken['https://auth0.weweb.io/metadata'] = user.user_metadata;

    return callback(null, user, context);
}`,
    enabled: true,
};
/* wwEditor:end */
