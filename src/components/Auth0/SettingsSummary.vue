<template>
    <div class="auth0-settings-edit caption-m">
        <wwEditorFormRow label="Copy all URLs in SPA settings">
            <div class="caption-m">Applications › SPA › Settings › Application URIs</div>
        </wwEditorFormRow>
        <wwEditorFormRow label="Allowed Callback URLs">
            <div class="auth0-settings-edit__row">
                <div class="auth0-settings-edit__url caption-s">{{ callbackUrls }}</div>
                <button type="button" class="ww-editor-button -icon -primary m-left" @click="copy(callbackUrls)">
                    <wwEditorIcon class="ww-editor-button-icon" name="copy-paste" />
                </button>
            </div>
        </wwEditorFormRow>
        <wwEditorFormRow label="Allowed Logout URLs">
            <div class="auth0-settings-edit__row">
                <div class="auth0-settings-edit__url caption-s">{{ logoutUrls }}</div>
                <button type="button" class="ww-editor-button -icon -primary m-left" @click="copy(logoutUrls)">
                    <wwEditorIcon class="ww-editor-button-icon" name="copy-paste" />
                </button>
            </div>
        </wwEditorFormRow>
        <wwEditorFormRow label="Allowed Web Origins">
            <div class="auth0-settings-edit__row">
                <div class="auth0-settings-edit__url caption-s">{{ origins }}</div>
                <button type="button" class="ww-editor-button -icon -primary m-left" @click="copy(origins)">
                    <wwEditorIcon class="ww-editor-button-icon" name="copy-paste" />
                </button>
            </div>
        </wwEditorFormRow>
        <wwEditorFormRow label="Allowed Origins (CORS)">
            <div class="auth0-settings-edit__row">
                <div class="auth0-settings-edit__url caption-s">{{ origins }}</div>
                <button type="button" class="ww-editor-button -icon -primary m-left" @click="copy(origins)">
                    <wwEditorIcon class="ww-editor-button-icon" name="copy-paste" />
                </button>
            </div>
        </wwEditorFormRow>
    </div>
</template>

<script>
export default {
    props: {
        settings: { type: Object, required: true },
    },
    computed: {
        pagesOptions() {
            return wwLib.wwWebsiteData.getPages().map(page => ({ label: page.name, value: page.id }));
        },
        website() {
            return wwLib.wwWebsiteData.getInfo();
        },
        callbackUrls() {
            return this.getUrls(this.settings.publicData.afterSignInPageId);
        },
        logoutUrls() {
            return this.getUrls(this.settings.publicData.afterNotSignInPageId);
        },
        origins() {
            return `https://${this.website.id}.${wwLib.wwApiRequests._getPreviewUrl()}, ${window.location.origin}`;
        },
    },
    methods: {
        getUrls(pageId) {
            const page = wwLib.wwWebsiteData.getPages().find(page => page.id === pageId);
            if (!page) return null;
            const isHomePageId = page.id === this.website.homePageId;
            const editorUrl = `${window.location.origin}/${this.website.id}/${isHomePageId ? '' : page.id}`;
            const frontUrls = page.langs.map(
                lang =>
                    `https://${this.website.id}.${wwLib.wwApiRequests._getPreviewUrl()}${wwLib.wwPageHelper.getPagePath(
                        page.id,
                        lang
                    )}`
            );
            return [...frontUrls, editorUrl].join(', ');
        },
        copy(string) {
            navigator.clipboard.writeText(string).then(
                function () {
                    wwLib.wwNotification.open({
                        text: 'URLs copied to clipboard.',
                        color: 'green',
                    });
                },
                function () {
                    wwLib.wwNotification.open({
                        text: 'Error while trying to copy URLs to clipboard.',
                        color: 'red',
                    });
                }
            );
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
    &__url {
        color: var(--ww-color-theme-dark-700);
        background-color: var(--ww-color-theme-dark-50);
        border: 1px solid var(--ww-color-theme-dark-100);
        padding: var(--ww-spacing-01) var(--ww-spacing-02);
        border-radius: var(--ww-border-radius-02);
    }
}
.m-left {
    margin-left: var(--ww-spacing-02);
}
</style>
