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
