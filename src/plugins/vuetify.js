import Vue from "vue";
import Vuetify from "vuetify/lib";
Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: "mdiSvg"
    },
    theme: {
        themes: {
            light: {
                primary: "#0e9bc0",
                secondary: "#E6EEF1",
                accent: "#2f99a3",
                error: "#eb5757",
                success: "#7dd012",
                warning: "#f59d34",
                info: "#1c9dd6",
                anchor: "#2d9cdb"
            }
            // dark: {
            //     primary: "#000031",
            //     secondary: "#3b4c89",
            //     accent: "#00255B"
            // }
        }
    }
});
