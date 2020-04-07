<template>
  <div id="app">
    <Sidebar />
    <nuxt-child class="main-content" />
    <!-- <Main /> -->
  </div>
</template>


<script>
import { mapState } from 'vuex'
import Sidebar from '~/components/Sidebar'

export default {
  components: {
    Sidebar
  },
  middleware: 'isAuthenticated',
  data() {
    return {
      classroomId: ''
    }
  },

  sockets: {
    class_has_started({ classroomName, classroomId }) {
      this.classroomId = classroomId
      this.$toast.open({
        type: 'info',
        message: `The ${classroomName} classroom has started. Click here to attend the class.`,
        position: 'top-right',
        duration: 5000,
        onClick: this.attendClass
      })
      return false
    }
  },
  computed: mapState({
    user: state => state.user
  }),
  methods: {
    attendClass() {
      this.$socket.emit('join_class', {
        userId: this.user._id,
        classroomId: this.classroomId
      })
      this.$router.push(`/app/classes/live/${this.classroomId}`)
    }
  },
  created() {
    this.$socket.emit('user_online', {
      email: this.user.email,
      name: this.user.name,
      avatar: this.user.avatar
    })
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
