function state() {
    return {
        user: {},
        jwtToken: '',
        isLoggedIn: false,
        apiUrl: process.env.baseUrl
    }
}

export default state;