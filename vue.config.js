const path = require("path");

process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
    configureWebpack: {
        resolve: {
            modules: [path.resolve("./src"), path.resolve("./node_modules")]
        },
        devServer: { proxy: "http://127.0.0.1:8989", port: 8000 }
    },
    transpileDependencies: ["vuetify"]
};
