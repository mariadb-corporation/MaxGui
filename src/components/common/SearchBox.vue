<template>
    <div class="search-box" :class="{ center: position === 'center', right: position === 'right' }">
        <input type="text" ref="search-input" :placeholder="placeholder" :value="value" @input="onInput($event)" />
        <v-icon :size="value.length ? 18 : 24" @click="clearInput" :class="`${value.length ? 'close' : 'search'}`" />
    </div>
</template>

<script>
export default {
    name: 'search-box',
    props: {
        focus: Boolean,
        position: {
            type: String,
            default: 'center',
        },
        placeholder: {
            type: String,
            default: 'searchTag',
        },
    },
    data() {
        return {
            value: '',
        };
    },
    watch: {
        focus(val) {
            if (val) this.$refs['search-input'].focus();
        },
    },
    methods: {
        onInput(e) {
            this.value = e.target.value;
            this.$emit('input', e.target.value);
        },
        clearInput() {
            if (this.value.length) {
                this.value = '';
                this.$emit('input', '');
            }
        },
    },
};
</script>
<style lang="scss" scopped>
.center {
    margin: 0 auto;
}

.right {
    float: right;
}

.search-box {
    max-width: 220px;
    padding: 13px 0;
    input {
        color: inherit;
        border-color: inherit !important;
        height: 30px;
        border: 2px solid;
        border-radius: 15px;
        width: 100%;
        padding-left: 15px;
        padding-right: 30px;
        &:focus {
            filter: brightness(150%);
            outline: none;
        }
        &::placeholder {
            color: inherit;
            opacity: 0.5;
        }
    }
    i.v-icon {
        position: absolute;
        line-height: 30px;
        transform: translate(-125%, 0);
        color: inherit;
    }
}
</style>
