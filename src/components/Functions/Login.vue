<template>
    <wwEditorFormRow label="Screen Hint">
        <wwEditorInputRadio :choices="screenHintChoices" :model-value="screenHint" @update:modelValue="setScreenHint" />
    </wwEditorFormRow>
    <wwEditorInputRow
        label="Organization"
        type="query"
        :model-value="organization"
        bindable
        placeholder="Enter an ID"
        @update:modelValue="setOrganization"
    />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    emits: ['update:args'],
    data() {
        return {
            screenHintChoices: [
                { label: 'Sign In', value: 'login', default: true },
                { label: 'Sign Up', value: 'signup' },
            ],
        };
    },
    computed: {
        screenHint() {
            return this.args.screenHint;
        },
        organization() {
            return this.args.organization;
        },
    },
    mounted() {
        if (!this.screenHint) this.setScreenHint('login');
    },
    methods: {
        setScreenHint(screenHint) {
            this.$emit('update:args', { ...this.args, screenHint });
        },
        setOrganization(organization) {
            this.$emit('update:args', {  ...this.args, organization });
        },
    },
};
</script>
