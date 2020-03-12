import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import icons from 'icons';
Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'md',
        values: icons,
    },
    theme: {
        themes: {
            light: {
                primary: '#0e9bc0',
                secondary: '#E6EEF1',
                accent: '#2f99a3',
                error: '#eb5757',
                warning: '#f59d34',
                info: '#1c9dd6',
                anchor: '#2d9cdb',
            },
            dark: {
                primary: '#121212',
                secondary: '#1E1E1E',
                accent: '#0b718c',
            },
        },
    },
});
