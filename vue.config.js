const path = require('path');

process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
        types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)));
    },

    configureWebpack: {
        resolve: {
            modules: [path.resolve('./src'), path.resolve('./node_modules')],
        },
        devServer: { port: 8000 },
    },

    transpileDependencies: ['vuetify'],

    css: {
        extract: false,
    },
};
function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [path.resolve(__dirname, './src/styles/constants.scss')],
        });
}
