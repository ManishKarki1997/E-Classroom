<template>
  <div>
    <toast position="ne"></toast>
    <Nuxt />
  </div>
</template>

<script>
import { Toast } from 'vuex-toast'
import { mapGetters } from 'vuex'

export default {
  components: {
    Toast,
  },
  methods: {
    loadColorScheme() {
      this.$store.commit('loadColorScheme')
    },
  },
  computed: {
    ...mapGetters(['user']),
  },
  created() {
    this.loadColorScheme()
    if (this.user && this.user.isKickedOut) {
      this.$router.push('/app/dashboard')
    }
  },
}
</script>
