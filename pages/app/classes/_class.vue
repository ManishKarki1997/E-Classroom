<template>
  <div id="single-class">
    <div class="classroom-sidebar">
      <div class="classroom-info">
        <img
          :src="apiStaticUrl + '/uploads/images/' + classroom.backgroundImage"
          alt="Classroom Image"
        />
        <div class="class-teacher-info">
          <h5>{{classroom.name}}</h5>
          <p v-if="classroom.createdBy">{{classroom.createdBy.name}}</p>
        </div>
      </div>
      <ul class="class-action-buttons-wrapper">
        <li>
          <button @click="showClassInfoModal=true">View</button>
        </li>
        <li>
          <nuxt-link :to="'/app/classes/' + classroom._id + '/resources'">Resources</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="'/app/classes/' + classroom._id + '/pending_requests'">Pending Requests</nuxt-link>
        </li>
      </ul>
    </div>
    <div class="classroom-individual-content">
      <nuxt-child />
    </div>

    <div v-if="showClassInfoModal" class="class-modal-wrapper">
      <ClassInfoModal
        @editClass="editClass"
        :classroom="classroom"
        @hideModal="hideTheModal"
        teaching="true"
        allowDirectEdit="true"
      />
    </div>
  </div>
</template>

<script>
import ClassInfoModal from '~/components/DashboardComponents/ClassInfoModal'

export default {
  components: {
    ClassInfoModal
  },
  data() {
    return {
      classroom: {},
      apiStaticUrl: '',
      showClassInfoModal: false
    }
  },
  methods: {
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
    },
    hideTheModal() {
      this.showClassInfoModal = false
    }
  },
  mounted() {
    this.classroom = this.$store.state.currentlyViewingClass
    this.apiStaticUrl = process.env.baseUrl
  }
}
</script>

<style lang="scss" scoped>
#single-class {
  margin-left: 4.5rem;
  width: 100%;
  height: 100%;
  display: flex;
}
.classroom-individual-content {
  width: 80%;
  height: 100%;
}
.classroom-sidebar {
  width: 20%;
  height: 100vh;

  .classroom-info {
    display: flex;
    padding: 8px 12px;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .class-teacher-info {
      margin-left: 8px;
    }
  }
}
</style>