<template>
    <wwEditorInputRow
        label="Family Name"
        type="query"
        :model-value="familyName"
        bindable
        placeholder="Enter a value"
        @update:modelValue="setFamilyName"
    />
    <wwEditorInputRow
        label="Given Name"
        type="query"
        :model-value="givenName"
        bindable
        placeholder="Enter a value"
        @update:modelValue="setGivenName"
    />
    <wwEditorInputRow
        label="Name"
        type="query"
        :model-value="name"
        bindable
        placeholder="Enter a value"
        @update:modelValue="setName"
    />
    <wwEditorInputRow
        label="Nickname"
        type="query"
        :model-value="nickname"
        bindable
        placeholder="Enter a value"
        @update:modelValue="setNickname"
    />
    <wwEditorInputRow
        label="Username"
        type="query"
        :model-value="username"
        bindable
        placeholder="Enter a value"
        @update:modelValue="setUsername"
    />
    <wwEditorInputRow
        label="Picture"
        type="query"
        :model-value="picture"
        bindable
        placeholder="Enter a value"
        @update:modelValue="setPicture"
    />
    <wwEditorInputRow
        label="Metadata"
        type="array"
        :model-value="metadata"
        bindable
        @update:modelValue="setMetadata"
        @add-item="setMetadata([...metadata, {}])"
    >
        <template #default="{ item, setItem }">
            <wwEditorInputRow
                type="query"
                :model-value="item.key"
                label="Key"
                placeholder="Enter a value"
                small
                @update:modelValue="setItem({ ...item, key: $event })"
            />
            <wwEditorInputRow
                type="query"
                :model-value="item.value"
                label="Value"
                placeholder="Enter a value"
                bindable
                small
                @update:modelValue="setItem({ ...item, value: $event })"
            />
        </template>
    </wwEditorInputRow>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: {
            type: Object,
            default: () => ({
                familyName: null,
                givenName: null,
                nickname: null,
                username: null,
                name: null,
                picture: null,
                metadata: [],
            }),
        },
    },
    emits: ['update:args'],
    computed: {
        familyName() {
            return this.args.familyName;
        },
        givenName() {
            return this.args.givenName;
        },
        nickname() {
            return this.args.nickname;
        },
        username() {
            return this.args.username;
        },
        name() {
            return this.args.name;
        },
        picture() {
            return this.args.picture;
        },
        metadata() {
            return this.args.metadata || [];
        },
    },
    methods: {
        setFamilyName(familyName) {
            this.$emit('update:args', { ...this.args, familyName });
        },
        setGivenName(givenName) {
            this.$emit('update:args', { ...this.args, givenName });
        },
        setNickname(nickname) {
            this.$emit('update:args', { ...this.args, nickname });
        },
        setUsername(username) {
            this.$emit('update:args', { ...this.args, username });
        },
        setName(name) {
            this.$emit('update:args', { ...this.args, name });
        },
        setPicture(picture) {
            this.$emit('update:args', { ...this.args, picture });
        },
        setMetadata(metadata) {
            this.$emit('update:args', { ...this.args, metadata });
        },
    },
};
</script>
