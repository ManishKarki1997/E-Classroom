<template>
  <div id="app">
    <Sidebar />
    <nuxt-child class="main-content" />
    <!-- <Main /> -->
  </div>
</template>


<script>
import Sidebar from '~/components/Sidebar'
export default {
  components: {
    Sidebar
  },
  validate({ store }) {
    if (!store.state.isLoggedIn) {
      this.$router.push('/get-started/login')
      return false
    }
    return true
  }
}
</script>

<style scoped>
#app {
  display: flex;
}
.main-content {
  margin-left: 3rem;
  /* padding: 12px 2rem; */
}
</style>
