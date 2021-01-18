import VueSocketIo from 'vue-socket.io'
import SocketIO from 'socket.io-client'

import Vue from 'vue'
import store from '~/store/index'
Vue.use(
  new VueSocketIo({
    // debug: true,
    connection: 'http://localhost:3000',
    vuex: {
      store,
    },
  })
)
