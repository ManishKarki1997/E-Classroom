import VuexPersist from 'vuex-persist';

const vuexLocalStorage = new VuexPersist({
    key: 'virtualclassroom',
    // storage: window.localStorage,
    reducer: state => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        jwtToken: state.jwtToken
    })
})

import state from './state.js'
import mutation from './mutations.js'
import action from './actions.js'

export default {
    state,
    mutation,
    action,
    plugins: [vuexLocalStorage.plugin]
}