import VuexPersist from 'vuex-persist'
import { createModule } from 'vuex-toast'
import 'vuex-toast/dist/vuex-toast.css'

const vuexLocalStorage = new VuexPersist({
  key: 'virtualclassroom',
  // storage: window.localStorage,
  reducer: (state) => ({
    apiUrl: state.apiUrl,
    isLoggedIn: state.isLoggedIn,
    jwtToken: state.jwtToken,
    preferredColorScheme: state.preferredColorScheme,
    tourEnabled: state.tourEnabled,
    currentlyViewingClass: state.currentlyViewingClass,
    folderContent: state.folderContent,
  }),
})

import state from './state.js'
import mutation from './mutations.js'
import action from './actions.js'
import getters from './getters.js'

export default {
  state,
  mutation,
  action,
  getters,
  plugins: [vuexLocalStorage.plugin],
  modules: {
    toast: createModule({
      dismissInterval: 8000,
    }),
  },
}
