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
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unused-vars': 0,
        'comma-dangle': 0,
        'no-tabs': 2,
        'no-var': 2,
        'no-template-curly-in-string': 1,
        'no-alert': 2,
        'no-eval': 2,
        camelcase: 0,
        'vue/max-len': [
            'error',
            {
                code: 100,
                template: 120,
                tabWidth: 4,
                comments: 120,
                ignorePattern: '',
                ignoreComments: false,
                ignoreTrailingComments: false,
                ignoreUrls: false,
                ignoreStrings: false,
                ignoreTemplateLiterals: false,
                ignoreRegExpLiterals: false,
                ignoreHTMLAttributeValues: true,
                ignoreHTMLTextContents: false,
            },
        ],
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
            },
        ],
        'vue/this-in-template': 'error',
        'vue/order-in-components': 'error',
        'vue/no-unused-components': 1,
        'vuetify/no-deprecated-classes': 'error',
        'vuetify/no-legacy-grid': 'error',
        'vue/attribute-hyphenation': 0,
        'vue/require-default-prop': 0,
        'vue/no-template-shadow': 0,
        'vue/name-property-casing': ['error', 'kebab-case'],
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

    extends: [
        'plugin:vue/recommended',
        'eslint:recommended',
        'prettier',
        'prettier/vue',
        '@vue/prettier',
    ],
}
