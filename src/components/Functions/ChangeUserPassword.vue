<template>
    <wwEditorFormRow label="Database" required>
        <template #append-label>
            <a class="auth0-functions__link" href="https://manage.auth0.com/#/connections/database" target="_blank">
                Find it here
            </a>
        </template>
        <wwEditorInputTextSelect
            :model-value="connection"
            placeholder="Select a database"
            :options="connectionOptions"
            @update:modelValue="setConnection"
        />
    </wwEditorFormRow>
    <wwEditorInputRow
        label="Email"
        type="query"
        :model-value="email"
        bindable
        placeholder="Enter an email"
        required
        @update:modelValue="setEmail"
    />
    <wwLoader :loading="isLoading" />
</template>

<script>
import { getConnections } from '../../wwPlugin.js';

export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    emits: ['update:args'],
    data() {
        return {
            isLoading: false,
            connections: [],
        };
    },
    computed: {
        connection() {
            return this.args.connection;
        },
        email() {
            return this.args.email;
        },
        connectionOptions() {
            return this.connections
                .filter(connection => connection.strategy === 'auth0')
                .map(connection => ({ label: connection.name, value: connection.name }));
        },
    },
    async mounted() {
        this.isLoading = true;
        try {
            this.connections = await getConnections(this.plugin.settings);
            if (!this.connection && this.connectionOptions.length) this.setConnection(this.connectionOptions[0].value);
        } catch (err) {
            wwLib.wwLog.error(err);
        }
        this.isLoading = false;
    },
    methods: {
        setConnection(connection) {
            this.$emit('update:args', { ...this.args, connection });
        },
        setEmail(email) {
            this.$emit('update:args', { ...this.args, email });
        },
    },
};
</script>

<style lang="scss" scoped>
.auth0-functions {
    &__link {
        color: var(--ww-color-content-brand);
        margin-left: var(--ww-spacing-02);
    }
}
</style>
