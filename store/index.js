// import VuexPersist from 'vuex-persist';

// const vuexLocalStorage = new VuexPersist({
//     key: 'torrents-app',
//     // storage: window.localStorage,
//     reducer: state => ({
//         torrentToSearch: state.torrentToSearch
//     })
// })

import state from './state.js'
import mutation from './mutation.js'
import action from './action.js'

export default {
    state,
    mutation,
    action,
    // plugins: [vuexLocalStorage.plugin]
}