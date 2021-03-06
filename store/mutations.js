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
  setIsLoading(state, isLoading) {
    state.isLoading = isLoading
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
  setUserAnnouncements(state, payload) {
    state.userAnnouncements = payload
  },
  setUserPersonalResources(state, payload) {
    state.userPersonalResources = payload
  },
  deleteUserSavedResourceFolders(state, payload) {
    state.userPersonalResources.userResourceFolders.splice(
      state.userPersonalResources.userResourceFolders.indexOf(payload),
      1
    )
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
  addNewClassAnnouncement(state, payload) {
    state.currentClassAnnouncements = [
      ...state.currentClassAnnouncements,
      payload,
    ]
  },
  setFolderContent(state, payload) {
    state.folderContent = payload
  },
  deleteCurrentClassResourceFolders(state, payload) {
    state.currentClassResourceFolders.splice(
      state.currentClassResourceFolders.indexOf(payload),
      1
    )
  },
  updateClassPendingRequest(state, user) {
    console.log(user._id, state.currentClassPendingRequests[0]._id)
    state.currentClassPendingRequests = state.currentClassPendingRequests.filter(
      (r) => r._id !== user._id
    )
    state.currentlyViewingClass.pendingJoinRequests.splice(
      state.currentlyViewingClass.pendingJoinRequests.indexOf(user._id),
      1
    )
  },
}
export default mutation
