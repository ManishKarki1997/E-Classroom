<template>
  <div id="dashboard">
    <main class="dashboard-main">
      <Notifications class="dashboard-notifications" />
      <EnrolledClasses class="dashboard-enrolled-classes" />
    </main>
    <div class="dashboard-right">
      <DashboardProfile />
      <UpcomingClass />
    </div>
  </div>
</template>

<script>
import DashboardProfile from '~/components/DashboardComponents/DashboardProfile'
import UpcomingClass from '~/components/DashboardComponents/UpcomingClass'
import Notifications from '~/components/DashboardComponents/Notifications'
import EnrolledClasses from '~/components/DashboardComponents/EnrolledClasses'

export default {
  components: {
    DashboardProfile,
    UpcomingClass,
    Notifications,
    EnrolledClasses
  }
}
</script>
