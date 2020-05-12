<template>
  <div id="pending-requests-wrapper">
    <h3>Pending Requests</h3>
    <div class="pending-requests-body">
      <div v-if="pendingJoinRequests.length>0" class="pending-requests">
        <div class="pending-request" v-for="user in pendingJoinRequests" :key="user._id">
          <div class="user-image-wrapper">
            <img
              @click="selectedUser=user"
              :src="apiStaticUrl + '/uploads/images/' + user.avatar"
              alt
            />
          </div>
          <div @click="selectedUser=user" class="user-info">
            <h4>{{user.name}}</h4>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No pending requests currently</p>
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
      const response = await this.$store.dispatch('pendingRequestDecision', {
        classId: this.classId,
        userId: this.$store.state.user._id,
        decision: actionType
      })

      if (response.data.error) {
        this.$toast.open({
          type: 'error',
          message: response.data.message,
          position: 'top-right',
          duration: 1500
        })
        return false
      } else {
        this.$toast.open({
          type: 'success',
          message: response.data.message,
          position: 'top-right',
          duration: 1500
        })
        this.fetchPendingRequests()
        this.$forceUpdate()
        this.selectedUser = {}
      }
    },
    async fetchPendingRequests() {
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
        console.log(this.pendingJoinRequests)
      }
    }
  },
  async mounted() {
    this.classId = this.$route.params.class
    this.apiStaticUrl = process.env.baseUrl
    this.fetchPendingRequests()
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
  // margin-top: -5rem;
  margin-top: 2rem;
  width: 80%;
}
.generic-user-profile-wrapper {
  width: 20%;
}
.pending-request {
  grid-column: span 3;
  // display: flex;
  // align-items: center;

  .user-image-wrapper {
    width: 100px;
    height: 100px;
    overflow: hidden;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 2px;
    object-fit: cover;
    // border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease-in;

    &:hover {
      transform: scale(1.05);
      transition: all 0.3s ease-out;
    }
  }

  .user-info {
    cursor: pointer;
    margin-top: 8px;
  }
}
</style>