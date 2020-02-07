const path = require("path");

process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  configureWebpack: {
    resolve: {
      modules: [path.resolve("./src"), path.resolve("./node_modules")]
    },
    devServer: { port: 8000 }
  },
  transpileDependencies: ["vuetify"]
};
