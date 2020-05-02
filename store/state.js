function state() {
    return {
        user: {},
        jwtToken: '',
        isLoggedIn: false,
        apiUrl: process.env.baseUrl,
        currentlyViewingClass: {},
        selectedResourceContents: {},
        liveClasses: [],
        notifications: [],
        skipTourNextTime: false
    }
}

export default state;