<template>
  <div id="enrolled-classes">
    <div>
      <h4>Currently Enrolled In</h4>
      <div class="available-classes" v-if="classes.length>0">
        <ClassCard
          v-for="availableClass in classes"
          :key="availableClass.id"
          class="class-card"
          :courseclass="availableClass"
          @classroomClicked="showClassInfoModal"
          teaching="false"
        />
      </div>

      <div v-else>
        <p>No classes available</p>
      </div>

      <div v-if="isShowingClassInfoModal" class="class-modal-wrapper">
        <ClassInfoModal
          hideJoinButton="false"
          :classroom="currentlyOpenClass"
          @hideModal="hideTheModal"
          @leaveClass="leaveClassroom"
          teaching="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ClassCard from '~/components/ClassCard'
import ClassInfoModal from '~/components/DashboardComponents/ClassInfoModal'

export default {
  components: {
    ClassCard,
    ClassInfoModal
  },
  data() {
    return {
      isShowingClassInfoModal: false,
      currentlyOpenClassId: '',
      currentlyOpenClass: null,
      classes: []
    }
  },
  methods: {
    showClassInfoModal(classroom) {
      this.isShowingClassInfoModal = true
      this.currentlyOpenClassId = classroom._id
      this.currentlyOpenClass = classroom
    },
    // when use clicks the cancel button in ClassInfoModal components, this method is called,
    // and receives a 'true' value as the parameter
    hideTheModal(value) {
      // always receives the boolean (true) to close the model
      this.isShowingClassInfoModal = !value //hide the model by setting this variable to false
    },
    async fetchUserClasses() {
      const result = await this.$store.dispatch('fetchUserClasses', {})
      const { joinedClasses } = result.data.payload

      if (result.data.error) {
        this.$toast.open({
          type: 'error',
          message:
            user.error.errorMessage ||
            'Something went wrong. Please try again.',
          position: 'top-right',
          duration: 1500
        })
        return false
      }
      this.classes = joinedClasses
    },
    async leaveClassroom(classId) {
      const response = await this.$store.dispatch('joinNewClass', {
        classId,
        userId: this.$store.state.user._id
      })

      const { error, message } = response.data

      if (!error) {
        this.$toast.open({
          type: 'success',
          message,
          position: 'top-right',
          duration: 1500
        })
        this.hideTheModal(true) // hide the modal
        this.fetchUserClasses()
        this.$forceUpdate() // hack, not preferred
      } else {
        this.$toast.open({
          type: 'error',
          message,
          position: 'top-right',
          duration: 1500
        })
        return false
      }
    }
  },
  mounted() {
    this.fetchUserClasses()
  }
}
</script>

<style lang="scss" scoped>
#enrolled-classes {
  min-width: 100%;

  h4 {
    margin-bottom: 1rem;
  }
}
</style>