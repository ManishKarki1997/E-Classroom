<template>
  <div id="pending-requests-wrapper">
    <h3>Pending Requests</h3>
    <div class="pending-requests-body">
      <div class="pending-requests">
        <div
          @click="selectedUser=user"
          class="pending-request"
          v-for="user in pendingJoinRequests"
          :key="user._id"
        >
          <img :src="apiStaticUrl + '/uploads/images/' + user.avatar" alt />
          <div class="user-info">
            <h4>{{user.name}}</h4>
          </div>
        </div>
      </div>
      <div class="generic-user-profile-wrapper">
        <GenericUserProfile
          @pendingRequestAction="pendingRequestAction"
          v-if="selectedUser.name!==undefined"
          :user="selectedUser"
        />
      </div>
    </div>
  </div>
</template>

<script>
import GenericUserProfile from '~/components/DashboardComponents/GenericUserProfile'

export default {
  components: {
    GenericUserProfile
  },
  data() {
    return {
      pendingJoinRequests: {},
      classId: '',
      apiStaticUrl: '',
      selectedUser: {}
    }
  },
  methods: {
    async pendingRequestAction(actionType) {
      this.$toast.open({
        type: 'success',
        message: 'The request was ' + actionType + 'ed',
        position: 'top-right',
        duration: 1500
      })
    }
  },
  async mounted() {
    this.classId = this.$route.params.class
    this.apiStaticUrl = process.env.baseUrl

    const response = await this.$store.dispatch('fetchClassPendingRequests', {
      classId: this.classId
    })
    if (response.error) {
      this.$toast.open({
        type: 'error',
        message: response.data.message,
        position: 'top-right',
        duration: 1500
      })
      return false
    } else {
      this.pendingJoinRequests = response.data.payload.pendingJoinRequests
      if (this.pendingJoinRequests.length > 0) {
        this.selectedUser = this.pendingJoinRequests[0]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#pending-requests-wrapper {
  padding: 8px;
}
.pending-requests-body {
  width: 100%;
  height: 100%;
  display: flex;
}
.pending-requests {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 1rem;
  margin-top: -9rem;
  width: 80%;
}
.generic-user-profile-wrapper {
  width: 20%;
}
.pending-request {
  grid-column: span 3;
  display: flex;
  align-items: center;
  cursor: pointer;
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  .user-info {
    margin-left: 8px;
  }
}
</style>