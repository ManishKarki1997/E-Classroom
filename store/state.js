function state() {
  return {
    user: {},
    jwtToken: '',
    isLoading: false,
    isLoggedIn: false,
    apiUrl: '',
    tourEnabled: false,
    preferredColorScheme: 'light',
    loadingInfo: {
      loading: false,
      message: '',
    },
    allClasses: [],
    userNotifications: [],
    userAnnouncements: [],
    userAssignments: [],
    userBookmarkedFolders: [],
    upcomingClasses: [],
    userPersonalResources: [], // user saved as well as all enrolled/teaching class' resources
    userResourceFolders: [],
    currentClassPendingRequests: [],
    currentClassResourceFolders: [],
    currentClassAnnouncements: [],
    currentClassStudents: [],
    currentlyViewingClass: null,
    folderContent: null,
    viewNotificationModal: {
      view: false,
      notification: null,
    },
  }
}

export default state
