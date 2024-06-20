<template>
    <div class="auth0-settings-edit">
        <wwEditorFormRow required label="Domain">
            <template #append-label>
                <a class="auth0-settings-edit__link" href="https://manage.auth0.com/#/apis" target="_blank">
                    Find it here
                </a>
            </template>
            <wwEditorInputText
                type="text"
                name="domain"
                placeholder="tenant-name.us.auth0.com"
                :model-value="settings.publicData.domain"
                large
                @update:modelValue="setDomain($event)"
            />
        </wwEditorFormRow>
        <wwEditorFormRow v-if="!settings.publicData.M2MClientId" required label="Token">
            <wwEditorInputText v-model="token" type="text" placeholder="" large @update:modelValue="onTokenChange" />
        </wwEditorFormRow>
        <wwEditorFormRow v-if="!settings.publicData.M2MClientId" required label="Default Application Name">
            <wwEditorInputText v-model="clientName" type="text" placeholder="Set a default application name" large />
        </wwEditorFormRow>
        <template v-else>
            <wwEditorFormRow required label="Single Page Application">
                <wwEditorInputTextSelect
                    placeholder="Select a Single Page Application"
                    :model-value="settings.publicData.SPAClientId"
                    large
                    :options="SPAClientOptions"
                    @update:modelValue="setSPAClient($event)"
                />
            </wwEditorFormRow>
            <wwEditorFormRow required label="Machine to Machine Application">
                <wwEditorInputTextSelect
                    placeholder="Select a Machine to Machine Application"
                    :model-value="settings.publicData.M2MClientId"
                    large
                    :options="M2MClientOptions"
                    @update:modelValue="setM2MClient($event)"
                />
            </wwEditorFormRow>
            <wwEditorFormRow label="Custom domain">
                <wwEditorInputText
                    type="text"
                    name="custom-domain"
                    placeholder="auth.domain.com"
                    :model-value="settings.publicData.customDomain"
                    large
                    @update:modelValue="setCustomDomain($event)"
                />
            </wwEditorFormRow>
            <wwEditorFormRow label="Audience">
                <wwEditorInputText
                    placeholder="https://test-api"
                    :model-value="settings.publicData.audience"
                    large
                    @update:modelValue="setAudience($event)"
                />
            </wwEditorFormRow>
            <wwEditorFormRow label="Scope">
                <wwEditorInputText
                    placeholder="Default: openid profile email"
                    :model-value="settings.publicData.scope"
                    large
                    @update:modelValue="setScope($event)"
                />
            </wwEditorFormRow>
            <wwEditorFormRow v-if="!isProd">
                <button type="button" class="ww-editor-button -primary -small" @click="setUpApps">
                    Set-Up Auth0 applications
                </button>
            </wwEditorFormRow>
        </template>
        <wwLoader :loading="isLoading" />
    </div>
</template>

<script>
import { getClients, createClient, updateClient, getSPAClientRedirection, SPA_CLIENT } from '../../wwPlugin.js';

export default {
    props: {
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    data() {
        return {
            isLoading: false,
            clients: [],
            token: undefined,
            clientName: wwLib.wwWebsiteData.getWebsiteName(),
        };
    },
    computed: {
        SPAClients() {
            return this.clients.filter(client => client.app_type === 'spa');
        },
        SPAClientOptions() {
            return this.SPAClients.map(client => ({ label: client.name, value: client.client_id }));
        },
        M2MClients() {
            return this.clients.filter(client => client.app_type === 'non_interactive');
        },
        M2MClientOptions() {
            return this.M2MClients.map(client => ({ label: client.name, value: client.client_id }));
        },
        isProd() {
            return wwLib.envMode === 'production';
        },
    },
    watch: {
        'settings.publicData'() {
            // refresh client
            wwLib.wwPlugins.auth0.createClient();
        },
    },
    async mounted() {
        this.isLoading = true;
        try {
            this.clients = await getClients(this.settings);
        } catch (err) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, M2MClientId: null },
                privateData: { ...this.settings.privateData, M2MClientSecret: null },
            });
        }
        this.isLoading = false;
    },
    methods: {
        setUpApps() {
            updateClient(this.settings, this.settings.publicData.SPAClientId, getSPAClientRedirection(this.settings));
        },
        setSPAClient(clientId) {
            const client = this.clients.find(client => client.client_id === clientId);
            if (!client) return;
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, SPAClientId: clientId },
                privateData: { ...this.settings.privateData, SPAClientSecret: client.client_secret },
            });
        },
        setM2MClient(clientId) {
            const client = this.clients.find(client => client.client_id === clientId);
            if (!client) return;
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, M2MClientId: clientId },
                privateData: { ...this.settings.privateData, M2MClientSecret: client.client_secret },
            });
        },
        setDomain(domain) {
            domain = domain.replace('https://', '').replace('/api/v2/', '');
            this.$emit('update:settings', { ...this.settings, publicData: { ...this.settings.publicData, domain } });
        },
        setAudience(audience) {
            this.$emit('update:settings', { ...this.settings, publicData: { ...this.settings.publicData, audience } });
        },
        setScope(scope) {
            this.$emit('update:settings', { ...this.settings, publicData: { ...this.settings.publicData, scope } });
        },
        setCustomDomain(customDomain) {
            customDomain = customDomain.replace('https://', '');
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, customDomain },
            });
        },
        async onTokenChange() {
            this.isLoading = true;
            try {
                this.clients = [...(await getClients(this.settings, this.settings.publicData.domain, this.token))];
                if (!this.SPAClients.length) {
                    const newClient = await createClient(
                        this.settings,
                        { ...SPA_CLIENT, name: this.clientName || wwLib.wwWebsiteData.getWebsiteName() },
                        this.settings.publicData.domain,
                        this.token
                    );
                    this.clients.push(newClient);
                }
                this.$emit('update:settings', {
                    ...this.settings,
                    publicData: {
                        ...this.settings.publicData,
                        M2MClientId: this.M2MClients[0].client_id,
                        SPAClientId: this.SPAClients[0].client_id,
                    },
                    privateData: {
                        ...this.settings.privateData,
                        M2MClientSecret: this.M2MClients[0].client_secret,
                        SPAClientSecret: this.SPAClients[0].client_secret,
                    },
                });
            } catch (err) {
                wwLib.wwNotification.open({ text: 'Make sure the domain and token are correct.', color: 'red' });
                wwLib.wwLog.error(err);
            }
            this.isLoading = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.auth0-settings-edit {
    display: flex;
    flex-direction: column;
    &__link {
        color: var(--ww-color-content-brand);
        margin-left: var(--ww-spacing-02);
    }
    &__row {
        display: flex;
        align-items: center;
    }
    &__radio-label {
        margin-left: var(--ww-spacing-02);
    }
}
</style>
