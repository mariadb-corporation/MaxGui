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
    rules: {
        'no-console': 1,
        'no-unused-vars': 0,
        'comma-dangle': 0,
        'no-tabs': 2,
        'no-var': 2,
        'no-template-curly-in-string': 1,
        'no-alert': 2,
        'no-eval': 2,
        camelcase: 0,
        'max-len': 0,
        indent: ['error', 4, { SwitchCase: 1 }],
        'vue/this-in-template': 'error',
        'vue/order-in-components': 'error',
        'vue/no-unused-components': 1,
        'vuetify/no-deprecated-classes': 'error',
        'vuetify/no-legacy-grid': 'error',
        'vue/attribute-hyphenation': 0,
        'vue/require-default-prop': 0,
        'vue/no-template-shadow': 0
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

    'extends': [
        'plugin:vue/recommended',
        'eslint:recommended',
        'prettier',
        'prettier/vue',
    ]
};
