import Vue from "vue"
import Vuetify from "vuetify/lib/framework"
import "@mdi/font/css/materialdesignicons.min.css"
import { colors, VList } from "vuetify/lib"

Vue.use(Vuetify, { components: { VList } })

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: { bg: colors.grey.darken3 },
      light: { bg: colors.grey.lighten3 },
    },
  },
})
