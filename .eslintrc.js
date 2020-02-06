module.exports = {
  env: {
    es6: true
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "babel-eslint"
  },
  plugins: ["vue"],
  extends: ["prettier", "prettier/vue"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? 2 : 1,
    "no-unused-vars": 0
  }
};
