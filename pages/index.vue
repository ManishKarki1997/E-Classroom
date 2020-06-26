<template>
  <div id="home">
    <!-- <Sidebar /> -->
    <Main />
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar'
import Main from '~/components/Main'

export default {
  components: {
    Sidebar,
    Main
  },
  mounted() {
    if (this.$store.state.user) {
      this.$router.push('/app/dashboard')
    }
  }
}
</script>

<style scoped>
#home {
  display: flex;
}
</style>
