import createAuth0Client from '@auth0/auth0-spa-js';

/* wwEditor:start */
import './components/MachineToMachine/SettingsEdit.vue';
import './components/MachineToMachine/SettingsSummary.vue';
import './components/Redirections/SettingsEdit.vue';
import './components/Redirections/SettingsSummary.vue';
import './components/SinglePageApp/SettingsEdit.vue';
import './components/SinglePageApp/SettingsSummary.vue';
import './components/Auth0/SettingsSummary.vue';
import { GET_AUTH0_ROLES } from './graphql';
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
    user: null,
    isAuthenticated: false,
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
        this.isAuthenticated = await this.client.isAuthenticated();
        this.user = await this.client.getUser();
    },
    async loginWithPopup(options, config) {
        try {
            await this.client.loginWithPopup(options, config);
            await this.setCookieSession();
            this.redirectAfterSignIn();
        } catch (err) {
            wwLib.wwLog.error(err);
        } finally {
            this.checkIsAuthenticated();
        }
    },
    loginWithRedirect(o) {
        /* wwFront:start */
        return this.client.loginWithRedirect(o);
        /* wwFront:end */
        /* wwEditor:start */
        // eslint-disable-next-line no-unreachable
        return this.loginWithPopup(o);
        /* wwEditor:end */
    },
    logout() {
        this.removeCookieSession();
        /* wwEditor:start */
        const website = wwLib.wwWebsiteData.getInfo();
        const page = wwLib.wwWebsiteData
            .getPages()
            .find(page => page.id === this.settings.publicData.afterNotSignInPageId);
        const isHomePage = page && page.id === website.homePageId;
        const redirectUriEditor =
            page && !isHomePage
                ? `${window.location.origin}/${website.id}/${page.id}`
                : `${window.location.origin}/${website.id}/`;
        this.client.logout({ returnTo: redirectUriEditor });
        setTimeout(wwLib.getEditorWindow().location.reload, 1000);
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
