<template>
  <div id="dashboard">
    <main class="dashboard-main">
      <Notifications class="dashboard-notifications" />
      <EnrolledClasses class="dashboard-enrolled-classes" />
    </main>
    <div class="dashboard-right">
      <DashboardProfile />
      <LiveClasses />
      <UpcomingClass :upcomingClasses="upcomingClasses" />
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

export default {
  components: {
    DashboardProfile,
    UpcomingClass,
    LiveClasses,
    Notifications,
    EnrolledClasses
  },
  data() {
    return {
      upcomingClasses: [],
      liveClasses: []
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
    }
  },
  mounted() {
    this.$socket.emit('get_all_live_classes', {
      userId: this.user._id,
      allUserClasses: this.user.joinedClasses
    })
  }
}
</script>
