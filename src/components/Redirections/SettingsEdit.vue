<template>
    <div class="auth0-settings-edit">
        <wwEditorFormRow required label="Page to redirect after the user signed-in">
            <wwEditorInputTextSelect
                name="after-sign-in-page-id"
                :options="pagesOptions"
                :model-value="settings.publicData.afterSignInPageId"
                placeholder="Select a page"
                large
                @update:modelValue="changePublicSettings('afterSignInPageId', $event)"
            />
        </wwEditorFormRow>
        <wwEditorFormRow required label="Page to redirect when user is not signed-in">
            <wwEditorInputTextSelect
                name="after-not-sign-in-page-id"
                :options="pagesOptions"
                :model-value="settings.publicData.afterNotSignInPageId"
                placeholder="Select a page"
                large
                @update:modelValue="changePublicSettings('afterNotSignInPageId', $event)"
            />
        </wwEditorFormRow>
    </div>
</template>

<script>
import { updateClient, getSPAClientRedirection } from '../../wwPlugin.js';

export default {
    props: {
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    computed: {
        pagesOptions() {
            return wwLib.wwWebsiteData.getPages().map(page => ({ label: page.name, value: page.id }));
        },
    },
    methods: {
        changePublicSettings(key, value) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, [key]: value },
            });
            updateClient(this.settings, this.settings.publicData.SPAClientId, getSPAClientRedirection(this.settings));
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
