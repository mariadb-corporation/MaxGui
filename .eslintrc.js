module.exports = {
    root: true,

    env: {
        node: true,
        es6: true,
    },

    parser: 'vue-eslint-parser',

    parserOptions: {
        parser: 'babel-eslint',
    },

    plugins: ['vue', 'vuetify'],
    extends: ['prettier', 'prettier/vue', 'plugin:vue/essential', 'eslint:recommended'],

    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
        'no-unused-vars': 0,
        'comma-dangle': 0,
        'no-tabs': 2,
        'no-var': 2,
        'no-template-curly-in-string': 1,
        'no-alert': 2,
        'no-eval': 2,
        camelcase: 0,
        'max-len': ['warn', 140, 1],
        indent: ['error', 4, { SwitchCase: 1 }],
        'vue/this-in-template': 'error',
        'vue/order-in-components': 'error',
    },

    overrides: [
        {
            files: ['*.vue'],
            rules: {
                indent: 'off',
            },
        },
        {
            files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
            env: {
                jest: true,
            },
        },
    ],
};
