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

<style scoped>
#dashboard {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.dashboard-main {
  width: 80%;
  padding: 14px 2rem;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 50px;
  grid-gap: 1rem;
}
.dashboard-notifications {
  grid-column: span 4;
  grid-row: span 4;
  background-color: white;
  padding: 8px 12px;
  border-radius: 2px;
  box-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 0.05);
}
.dashboard-enrolled-classes {
  grid-column: span 4;
  grid-row: span 6;
  background-color: white;
  padding: 8px 12px;
  border-radius: 2px;
  box-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 0.05);
}
.dashboard-right {
  width: 20%;
  background-color: white;
  padding: 6px 10px;
  box-shadow: 2px 2px 8px 4px rgba(0, 0, 0, 0.1);
}
</style>