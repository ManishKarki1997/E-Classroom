<template>
  <div>
    <Sidebar />
    <nuxt-child class="dashboard-content" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from '~/components/Sidebar'
import DashboardContents from '~/components/Sidebar'
export default {
  components: {
    Sidebar,
  },
  computed: {
    ...mapGetters(['user', 'isLoggedIn']),
  },
  watch: {
    user: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.$socket.emit('user_online', {
            ...this.user,
          })
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    if (!this.isLoggedIn) {
      this.router.push('/login')
    } else {
      this.$store.dispatch('getUserDetails')
    }
  },
}
</script>
