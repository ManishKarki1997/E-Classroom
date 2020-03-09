<template>
  <div id="dashboard">
    <main class="dashboard-main">
      <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h2>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni perspiciatis rerum fugit quae, voluptatum quam placeat nulla doloremque sunt, at veritatis distinctio! Nemo laboriosam dolore porro perspiciatis pariatur nostrum unde.</p>
    </main>
    <div class="dashboard-right">
      <DashboardProfile />
      <UpcomingClass />
      <Notifications />
    </div>
  </div>
</template>

<script>
import DashboardProfile from '~/components/DashboardComponents/DashboardProfile'
import UpcomingClass from '~/components/DashboardComponents/UpcomingClass'
import Notifications from '~/components/DashboardComponents/Notifications'

export default {
  components: {
    DashboardProfile,
    UpcomingClass,
    Notifications
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
}
.dashboard-right {
  width: 20%;
  background-color: white;
  padding: 6px 10px;
  box-shadow: 2px 2px 8px 4px rgba(0, 0, 0, 0.1);
}
</style>