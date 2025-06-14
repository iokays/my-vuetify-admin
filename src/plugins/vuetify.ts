/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import {createVuetify} from 'vuetify'
import {VTreeview} from 'vuetify/labs/VTreeview'
import {md3} from 'vuetify/blueprints'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  blueprint: md3,
  theme: {
    defaultTheme: 'dark',
  },
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },
  components: {
    VTreeview,
  }
})
