/*
 * Copyright (c) 2020 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2024-07-01
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */

const path = require('path')
const fs = require('fs')

process.env.VUE_APP_VERSION = require('./package.json').version
let devServer = {
    https: {
        key: fs.readFileSync('./.certs/localhost+1-key.pem'),
        cert: fs.readFileSync('./.certs/localhost+1.pem'),
    },
    progress: false,
    port: 8000,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    public: 'https://localhost:8000/',
    proxy: {
        '^/': {
            changeOrigin: true,
            target: process.env.VUE_APP_API,
        },
    },
}
process.env.NODE_ENV !== 'development' && (devServer = {})

module.exports = {
    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))
        config.module.rule('js').exclude.add(/\.worker\.js$/)
    },

    configureWebpack: {
        optimization: {
            splitChunks: {
                minSize: 10000,
                maxSize: 250000,
            },
        },
        resolve: {
            modules: [path.resolve('./src'), path.resolve('./node_modules')],
        },
        module: {
            rules: [
                {
                    test: /\.worker\.js$/,
                    loader: 'worker-loader',
                    options: {
                        inline: true,
                        fallback: false,
                        name: '[name]:[hash:8].js',
                    },
                },
            ],
        },
        devServer: devServer,
        devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : 'none',
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

    productionSourceMap: false,
}
function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [path.resolve(__dirname, './src/styles/constants.scss')],
        })
}
