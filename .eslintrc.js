module.exports = {
    env: {
        es6: true
    },
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "babel-eslint"
    },
    plugins: ["vue", "vuetify"],
    extends: ["prettier", "prettier/vue"],
    rules: {
        // "no-console": process.env.NODE_ENV === "production" ? 2 : 1,
        "no-unused-vars": 0,
        "comma-dangle": 0,
        "no-tabs": 2,
        "no-var": 2,
        "no-template-curly-in-string": 1,
        "no-alert": 2,
        "no-eval": 2,
        camelcase: 2,
        "max-len": ["warn", 140, 1],
        indent: ["error", 4]
    }
};
