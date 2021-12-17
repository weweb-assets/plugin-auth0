<template>
    <wwEditorInputRow
        label="Email"
        type="query"
        :model-value="email"
        bindable
        placeholder="Enter a value"
        @update:modelValue="setEmail"
    />
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
        label="Phone Number"
        type="query"
        :model-value="phoneNumber"
        bindable
        placeholder="Enter a value"
        @update:modelValue="setPhoneNumber"
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
        args: { type: Array, default: () => [null, null, null, null, null, null, null, null, []] },
    },
    emits: ['update:args'],
    computed: {
        email() {
            return this.args[0];
        },
        familyName() {
            return this.args[1];
        },
        givenName() {
            return this.args[2];
        },
        nickname() {
            return this.args[3];
        },
        username() {
            return this.args[4];
        },
        name() {
            return this.args[5];
        },
        picture() {
            return this.args[6];
        },
        phoneNumber() {
            return this.args[7];
        },
        metadata() {
            return this.args[8] || [];
        },
    },
    methods: {
        setEmail(email) {
            this.$emit('update:args', [
                email,
                this.familyName,
                this.givenName,
                this.nickname,
                this.username,
                this.name,
                this.picture,
                this.phoneNumber,
                this.metadata,
            ]);
        },
        setFamilyName(familyName) {
            this.$emit('update:args', [
                this.email,
                familyName,
                this.givenName,
                this.nickname,
                this.username,
                this.name,
                this.picture,
                this.phoneNumber,
                this.metadata,
            ]);
        },
        setGivenName(givenName) {
            this.$emit('update:args', [
                this.email,
                this.familyName,
                givenName,
                this.nickname,
                this.username,
                this.name,
                this.picture,
                this.phoneNumber,
                this.metadata,
            ]);
        },
        setNickname(nickname) {
            this.$emit('update:args', [
                this.email,
                this.familyName,
                this.givenName,
                nickname,
                this.username,
                this.name,
                this.picture,
                this.phoneNumber,
                this.metadata,
            ]);
        },
        setUsername(username) {
            this.$emit('update:args', [
                this.email,
                this.familyName,
                this.givenName,
                this.nickname,
                username,
                this.name,
                this.picture,
                this.phoneNumber,
                this.metadata,
            ]);
        },
        setName(name) {
            this.$emit('update:args', [
                this.email,
                this.familyName,
                this.givenName,
                this.nickname,
                this.username,
                name,
                this.picture,
                this.phoneNumber,
                this.metadata,
            ]);
        },
        setPicture(picture) {
            this.$emit('update:args', [
                this.email,
                this.familyName,
                this.givenName,
                this.nickname,
                this.username,
                this.name,
                picture,
                this.phoneNumber,
                this.metadata,
            ]);
        },
        setPhoneNumber(phoneNumber) {
            this.$emit('update:args', [
                this.email,
                this.familyName,
                this.givenName,
                this.nickname,
                this.username,
                this.name,
                this.picture,
                phoneNumber,
                this.metadata,
            ]);
        },
        setMetadata(metadata) {
            this.$emit('update:args', [
                this.email,
                this.familyName,
                this.givenName,
                this.nickname,
                this.username,
                this.name,
                this.picture,
                this.phoneNumber,
                metadata,
            ]);
        },
    },
};
</script>
