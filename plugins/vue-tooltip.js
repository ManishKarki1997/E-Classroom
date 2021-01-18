import Vue from 'vue'
import VTooltip from 'v-tooltip'
import vueAwesomeCountdown from 'vue-awesome-countdown'

Vue.use(vueAwesomeCountdown)

Vue.use(VTooltip, {
  classes: ['info'],
  offset: 100,
  delay: {
    show: 500,
    hide: 300,
  },
})
