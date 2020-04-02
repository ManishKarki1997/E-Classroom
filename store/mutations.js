const mutation = {
    setUser(state, { user, jwtToken }) {
        state.user = user;
        state.jwtToken = jwtToken;
        state.isLoggedIn = true;
    },
    setCurrentlyViewingClass(state, { currentlyViewingClass }) {
        state.currentlyViewingClass = currentlyViewingClass;
    }
}

export default mutation;