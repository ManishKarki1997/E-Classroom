export default {
  apiUrl: (state) => state.apiUrl,
  user: (state) => state.user,
  isAdmin: (state) => state.user && state.user.userType === 'ADMIN',
  jwtToken: (state) => state.jwtToken,
  isLoggedIn: (state) => state.isLoggedIn,
  tourEnabled: (state) => state.tourEnabled,
  preferredColorScheme: (state) => state.preferredColorScheme,
  allClasses: (state) => state.allClasses,
  userNotifications: (state) => state.userNotifications,
  userResourceFolders: (state) => state.userResourceFolders,
  userPersonalResources: (state) => state.userPersonalResources,
  currentlyViewingClass: (state) => state.currentlyViewingClass,
  currentClassStudents: (state) => state.currentClassStudents,
  currentClassPendingRequests: (state) => state.currentClassPendingRequests,
  currentClassResourceFolders: (state) => state.currentClassResourceFolders,
  currentClassAnnouncements: (state) => state.currentClassAnnouncements,
  folderContent: (state) => state.folderContent,
  userBookmarkedFolders: (state) => state.userBookmarkedFolders,
}
