<template>
    <wwEditorInputRow
        label="Email"
        type="query"
        :model-value="email"
        bindable
        placeholder="Enter a value"
        @update:modelValue="setEmail"
    />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    emits: ['update:args'],
    computed: {
        email() {
            return this.args.email;
        },
    },
    methods: {
        setEmail(email) {
            this.$emit('update:args', { email });
        },
    },
};
</script>
