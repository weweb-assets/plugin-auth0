<template>
    <div class="auth0-settings-edit">
        <wwEditorFormRow required label="Domain">
            <template #append-label>
                <a class="auth0-settings-edit__link" href="https://manage.auth0.com/#/tenant/general" target="_blank">
                    Find it here
                </a>
            </template>
            <wwEditorInputText
                type="text"
                name="domain"
                placeholder="tenant-name.us.auth0.com"
                :model-value="settings.publicData.domain"
                large
                @update:modelValue="changePublicSettings('domain', $event)"
            />
        </wwEditorFormRow>
        <wwEditorFormRow v-if="!settings.publicData.M2MClientId" required label="Token">
            <template #append-label>
                <a class="auth0-settings-edit__link" href="https://manage.auth0.com/#/apis" target="_blank">
                    Find it here
                </a>
            </template>
            <wwEditorInputText v-model="token" type="text" placeholder="" large @update:modelValue="onTokenChange" />
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
        </template>
        <wwLoader :loading="isLoading" />
    </div>
</template>

<script>
import { getClients, createClient, SPA_CLIENT } from '../../wwPlugin.js';

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
        changePublicSettings(key, value) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, [key]: value },
            });
        },
        async onTokenChange() {
            this.isLoading = true;
            try {
                this.clients = await getClients(this.settings, this.settings.publicData.domain, this.token);
                this.$emit('update:settings', {
                    ...this.settings,
                    publicData: { ...this.settings.publicData, M2MClientId: this.M2MClients[0].client_id },
                    privateData: { ...this.settings.privateData, M2MClientSecret: this.M2MClients[0].client_secret },
                });
                if (!this.SPAClientOptions.length) {
                    const newClient = await createClient(
                        this.settings,
                        SPA_CLIENT,
                        this.settings.publicData.domain,
                        this.token
                    );
                    this.clients.push(newClient);
                }
                this.$emit('update:settings', {
                    ...this.settings,
                    publicData: { ...this.settings.publicData, SPAClientId: this.SPAClients[0].client_id },
                    privateData: { ...this.settings.privateData, SPAClientSecret: this.SPAClients[0].client_secret },
                });
            } catch (err) {
                wwLib.wwNotification.open({ text: 'Make sure the domain and token are correct.', color: 'red' });
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
        color: var(--ww-color-blue-500);
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
