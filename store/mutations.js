const mutation = {
    setUser(state, { user, jwtToken }) {
        state.user = user;
        state.jwtToken = state.jwtToken || jwtToken;
        state.isLoggedIn = true;
    },
    setLiveClasses(state, liveClasses) {
        state.liveClasses = liveClasses
    },
    setSkipTourNextTime(state, value) {
        state.skipTourNextTime = value
    },
    setPreferredColorScheme(state, value) {
        state.preferredColorScheme = value;
    },
    setNotifications(state, { addIntoExisting, data }) {
        addIntoExisting ? state.notifications.push(data) : state.notifications = data;
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