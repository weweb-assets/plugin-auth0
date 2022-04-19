<template>
    <wwEditorFormRow label="Screen Hint">
        <wwEditorInputRadio :choices="screenHintChoices" :model-value="screenHint" @update:modelValue="setScreenHint" />
    </wwEditorFormRow>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, default: () => ({ screenHint: 'login' }) },
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
    },
    methods: {
        setScreenHint(screenHint) {
            this.$emit('update:args', { screenHint });
        },
    },
};
</script>
