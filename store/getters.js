export default {
    getUserInfo: (state) => {
        return state.user
    },
    getOnlineClasses: (state) => {
        return state.liveClasses
    },
    getNotifications: (state) => {
        return state.notifications
    },
    getSkipTourSettingsValue: (state) => {
        return state.skipTourNextTime
    }
}