const mutation = {
    setUser(state, { user, jwtToken }) {
        state.user = user;
        state.jwtToken = jwtToken;
        state.isLoggedIn = true;
    },
    setLiveClasses(state, liveClasses) {
        state.liveClasses = liveClasses
    },
    setCurrentlyViewingClass(state, { currentlyViewingClass }) {
        state.currentlyViewingClass = currentlyViewingClass;
    },
    logout(state, payload) {
        state.user = {}
        state.jwtToken = ''
        state.isLoggedIn = false
        state.currentlyViewingClass = {}
    },
    setSelectedResourceContents(state, payload) {
        state.selectedResourceContents = payload
    }
}

export default mutation;