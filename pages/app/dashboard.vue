<template>
  <div id="dashboard">
    <main class="dashboard-main">
      <Notifications class="dashboard-notifications" />
      <EnrolledClasses class="dashboard-enrolled-classes" />
      <SavedResources class="dashboard-saved-resources" />
    </main>
    <div class="dashboard-right">
      <DashboardProfile />
      <LiveClasses />
      <UpcomingClass />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import DashboardProfile from '~/components/DashboardComponents/DashboardProfile'
import UpcomingClass from '~/components/DashboardComponents/UpcomingClass'
import LiveClasses from '~/components/DashboardComponents/LiveClasses'
import Notifications from '~/components/DashboardComponents/Notifications'
import EnrolledClasses from '~/components/DashboardComponents/EnrolledClasses'
import SavedResources from '~/components/DashboardComponents/SavedResources'

export default {
  components: {
    DashboardProfile,
    UpcomingClass,
    LiveClasses,
    Notifications,
    EnrolledClasses,
    SavedResources
  },
  data() {
    return {
      upcomingClasses: [],
      liveClasses: [],
      notifications: []
    }
  },
  methods: {
    async fetchUserDetails() {
      const response = await this.$store.dispatch('getUserDetails')
      if (response.data.error) {
        this.$toast.open({
          type: 'error',
          message: response.data.message,
          position: 'top-right',
          duration: 1500
        })
        return false
      } else {
        const { user } = response.data.payload
        this.$store.commit('setUser', { user, jwtToken: null })
      }
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  sockets: {
    all_live_classes(allOnlineClasses) {
      this.$store.commit('setLiveClasses', allOnlineClasses)
    },
    new_notification(notificationContent) {
      this.$toast.open({
        type: 'info',
        message: notificationContent,
        position: 'top-right',
        duration: 1500
      })
      this.$store.commit('setNotifications', {
        addIntoExisting: true,
        data: { title: notificationContent }
      })
    }
  },
  mounted() {
    this.$socket.emit('get_all_live_classes', {
      userId: this.user._id,
      allUserClasses: this.user.joinedClasses
    })

    this.$socket.emit('user_is_online', {
      name: this.user.name,
      userId: this.user._id
    })

    this.fetchUserDetails()

    // this.fetchNotifications()
    // Just for testing purposes
    // this.$socket.emit('new_notification', {
    //   classId: '5e7f8e3a83550d2d78403950',
    //   notification: {
    //     type: 'RESOURCE_CREATED'
    //   }
    // })
  }
}
</script>
