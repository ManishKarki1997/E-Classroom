function state() {
    return {
        user: {},
        jwtToken: '',
        isLoggedIn: false,
        apiUrl: process.env.baseUrl,
        currentlyViewingClass: {}
    }
}

export default state;