import i18n from 'plugins/i18n'

export const APP_CONFIG = Object.freeze({
    productName: i18n.t('productName'),
    navigation: {
        maxscale: [
            { title: 'Dashboard', route: 'dashboard', size: 22, icon: '$vuetify.icons.tachometer' },
            { title: 'Statistics', route: 'statistics', size: 22, icon: '$vuetify.icons.reports' },
            { title: 'Users', route: 'users', size: 22, icon: '$vuetify.icons.users' },
            { title: 'Settings', route: 'settings', size: 22, icon: '$vuetify.icons.settings' },
        ],
    },
})
