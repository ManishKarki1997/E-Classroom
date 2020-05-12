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
        tourEnabled: false,
        preferredColorScheme: 'light',
    }
}

export default state;