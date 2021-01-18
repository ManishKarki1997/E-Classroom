const mutation = {
  setUser(state, { user, jwtToken }) {
    state.user = user
    state.jwtToken = state.jwtToken || jwtToken
    state.isLoggedIn = true
  },
  logout(state) {
    state.jwtToken = null
    state.isLoggedIn = false
    state.user = null
    state.currentlyViewingClass = null
    state.folderContent = null
  },
  setRootUrl(state, payload) {
    state.apiUrl = payload
  },
  setLoadingInfo(state, payload) {
    state.loadingInfo = { ...payload }
  },
  resetLoadingInfo(state) {
    state.loadingInfo = {
      loading: false,
      message: '',
    }
  },
  setPreferredColorScheme(state, payload) {
    state.preferredColorScheme = payload
    state.preferredColorScheme === 'dark'
      ? document.body.setAttribute('theme', 'dark')
      : document.body.setAttribute('theme', '')
  },
  loadColorScheme(state) {
    state.preferredColorScheme === 'dark'
      ? document.body.setAttribute('theme', 'dark')
      : document.body.setAttribute('theme', '')
  },
  setviewNotificationModal(state, payload) {
    state.viewNotificationModal = { ...payload }
  },

  // user
  setUserResourceFolders(state, payload) {
    state.userResourceFolders = payload
  },
  setUserAssignments(state, payload) {
    state.userAssignments = payload
  },
  setUserBookmarkedFolders(state, payload) {
    state.userBookmarkedFolders = payload
  },
  setUserNotifications(state, payload) {
    state.userNotifications = payload
  },
  setUserPersonalResources(state, payload) {
    state.userPersonalResources = payload
    console.log(state.userPersonalResources)
  },

  // Classes
  setUpcomingClasses(state, payload) {
    state.upcomingClasses = payload
  },
  setAllClasses(state, payload) {
    state.allClasses = payload
  },
  setCurrentlyViewingClass(state, payload) {
    state.currentlyViewingClass = payload
  },
  setCurrentClassPendingRequests(state, payload) {
    state.currentClassPendingRequests = payload
  },
  setCurrentClassStudents(state, payload) {
    state.currentClassStudents = payload
  },
  setCurrentClassResourceFolders(state, payload) {
    state.currentClassResourceFolders = payload
  },
  setCurrentClassAnnouncements(state, payload) {
    state.currentClassAnnouncements = payload
  },
  setFolderContent(state, payload) {
    state.folderContent = payload
  },
}
export default mutation
