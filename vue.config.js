const path = require('path')
process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))
    },

    configureWebpack: {
        resolve: {
            modules: [path.resolve('./src'), path.resolve('./node_modules')],
        },
        devServer: {
            progress: false,
            port: 8000,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            proxy: {
                '^/': {
                    changeOrigin: true,
                    target: process.env.VUE_APP_API,
                },
            },
        },
    },

    // css: {
    //     extract: false, //set it to be true to include css in the head tag
    // },
    transpileDependencies: ['vuetify'],

    outputDir: `${process.env.buildPath}/gui`,

    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: true,
        },
    },
}
function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [path.resolve(__dirname, './src/styles/constants.scss')],
        })
}
