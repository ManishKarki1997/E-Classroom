function state() {
  return {
    user: null,
    jwtToken: '',
    isLoggedIn: false,
    apiUrl: process.env.baseUrl,
    currentlyViewingClass: {},
    selectedResourceContents: {},
    liveClasses: [],
    notifications: [],
    tourEnabled: false,
    preferredColorScheme: 'light'
  }
}

export default state
