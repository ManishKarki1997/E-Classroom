<template>
  <div id="enrolled-classes">
    <div>
      <h4>Currently Teaching Classes</h4>
      <div class="available-classes" v-if="classes.length>0">
        <ClassCard
          v-for="availableClass in classes"
          :key="availableClass.id"
          class="class-card"
          :courseclass="availableClass"
          @classroomClicked="showClassInfoModal"
        />
      </div>

      <div v-else>
        <p>No classes available</p>
      </div>

      <div v-if="isShowingClassInfoModal" class="class-modal-wrapper">
        <ClassInfoModal
          @editClass="editClass"
          :classroom="currentlyOpenClass"
          @hideModal="hideTheModal"
          teaching="true"
          allowDirectEdit="true"
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
    gotoSingleClassView() {
      this.$store.commit('setCurrentlyViewingClass', {
        currentlyViewingClass: this.currentlyOpenClass
      })
      this.$router.push(`/app/classes/${this.classroom._id}`)
    },
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
    async editClass(backgroundImage) {
      if (
        this.currentlyOpenClass.name === '' ||
        this.currentlyOpenClass.description === '' ||
        this.currentlyOpenClass.shortInfo === '' ||
        this.currentlyOpenClass.startTime === '' ||
        this.currentlyOpenClass.endTime === ''
      ) {
        this.$toast.open({
          type: 'error',
          message: 'Please fill all the required fields.',
          position: 'top-right',
          duration: 1500
        })
        return false
      }

      const classId = this.currentlyOpenClassId
      let formData = new FormData()
      formData.append('name', this.currentlyOpenClass.name)
      formData.append('shortInfo', this.currentlyOpenClass.shortInfo)
      formData.append('classId', classId)
      formData.append('description', this.currentlyOpenClass.description)
      formData.append('image', backgroundImage)
      formData.append('startTime', this.currentlyOpenClass.startTime)
      formData.append('endTime', this.currentlyOpenClass.endTime)

      const response = await this.$store.dispatch('updateClass', formData)
      const { error, payload, message } = response.data
      if (error) {
        this.$toast.open({
          type: 'error',
          message,
          position: 'top-right',
          duration: 1500
        })
      } else {
        this.$toast.open({
          type: 'success',
          message: 'Class successfully updated.',
          position: 'top-right',
          duration: 1500
        })
        this.$forceUpdate()
        this.hideTheModal(true)
      }
    }
  },
  async mounted() {
    const result = await this.$store.dispatch('fetchUserClasses', {})
    const { createdClasses } = result.data.payload

    if (result.data.error) {
      this.$toast.open({
        type: 'error',
        message:
          user.error.errorMessage || 'Something went wrong. Please try again.',
        position: 'top-right',
        duration: 1500
      })
      return false
    }
    this.classes = createdClasses
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