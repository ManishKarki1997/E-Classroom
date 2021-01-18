<template>
  <div>
    <Sidebar />
    <nuxt-child />
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar'
import DashboardContents from '~/components/Sidebar'
export default {
  components: {
    Sidebar,
  },
}
</script>
