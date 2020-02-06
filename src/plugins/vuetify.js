import Vue from "vue";
import Vuetify from "vuetify/lib";
import 'material-design-icons-iconfont/dist/material-design-icons.css'
Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "md"
  },
  theme: {
    themes: {
      light: {
        primary: "#F49831",
        secondary: "#ffc962",
        accent: "#F49831"
      },
      dark: {
        primary: "#000031",
        secondary: "#3b4c89",
        accent: "#00255B"
      }
    }
  }
});

// primary: {
//     light: '#ffc962',
//     main: '#F49831',
//     dark: '#bc6a00',
//     contrastText: '#000000',

// },
// secondary: {
// light: '#3b4c89',
// main: '#00255B',
// dark: '#000031',
// contrastText: '#ffffff',

// }
