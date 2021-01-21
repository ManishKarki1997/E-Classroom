<template>
  <div>
    <h2>Pending Requests</h2>
    <div
      class="no-data-available"
      v-if="currentClassPendingRequests.length == 0"
    >
      <h5>No pending join requests</h5>
    </div>
    <div v-else>
      <div class="user-cards">
        <UserCard
          v-for="userRequest in currentClassPendingRequests"
          :key="userRequest._id"
          :userInfo="userRequest"
          :actions="['accept', 'reject']"
          @handlePendingRequest="handlePendingRequest"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from '~/components/UserCard'

export default {
  components: {
    UserCard,
  },
  computed: {
    ...mapGetters(['currentClassPendingRequests', 'currentlyViewingClass']),
  },
  data() {
    return {
      classId: '',
    }
  },
  methods: {
    fetchClassPendingRequests() {
      this.$store.dispatch('fetchClassPendingRequests', this.classId)
    },
    handlePendingRequest(decision) {
      this.$store.dispatch('pendingRequestDecision', decision)
    },
  },
  mounted() {
    this.classId = this.$route.params.classId
    this.fetchClassPendingRequests()
  },
}
</script>

<style lang="scss" scoped>
.user-cards {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 2rem;
  margin-top: 1rem;

  .no-data-available {
    margin-top: 1rem;
  }
}
</style>
