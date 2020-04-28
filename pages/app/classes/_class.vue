<template>
  <div id="single-class" :class="{darken:addResourceModalActive}">
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
      <button
        @click="gotoClass"
        style="background-color:black; color:white; cursor-pointer;"
      >Goto Class</button>
      <!-- <button
        @click="streamClass"
        style="background-color:black; color:white; cursor-pointer;"
      >Start Class</button>-->
      <ul class="class-action-buttons-wrapper">
        <li v-if="isClassroomCreator">
          <p @click="showClassInfoModal=true">View</p>
        </li>
        <li>
          <p @click="goto('resources')">Resources</p>
          <!-- <nuxt-link :to="'/app/classes/' + classroom._id + '/resources'">Resources</nuxt-link> -->
        </li>
        <li v-if="isClassroomCreator">
          <p @click="goto('pending_requests')">Pending Requests</p>
          <!-- <nuxt-link :to="'/app/classes/' + classroom._id + '/pending_requests'">Pending Requests</nuxt-link> -->
        </li>
      </ul>
    </div>
    <div class="classroom-individual-content">
      <nuxt-child @addResourceModalActive="hello" />
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
      showClassInfoModal: false,
      editButtonClicked: false,
      addResourceModalActive: false,
      isClassroomCreator: false
    }
  },
  methods: {
    hello(value) {
      this.addResourceModalActive = value
    },
    goto(route) {
      this.$router.push(`/app/classes/${this.classroom._id}/${route}`)
      console.log(this.isClassroomCreator)
    },
    async editClass(backgroundImage) {
      this.editButtonClicked = true
      if (
        this.classroom.name === '' ||
        this.classroom.description === '' ||
        this.classroom.shortInfo === '' ||
        this.classroom.startTime === '' ||
        this.classroom.endTime === ''
      ) {
        this.$toast.open({
          type: 'error',
          message: 'Please fill all the required fields.',
          position: 'top-right',
          duration: 1500
        })
        return false
      }

      const classId = this.classroom._id
      let formData = new FormData()
      formData.append('name', this.classroom.name)
      formData.append('shortInfo', this.classroom.shortInfo)
      formData.append('classId', classId)
      formData.append('description', this.classroom.description)
      formData.append('image', backgroundImage)
      formData.append('startTime', this.classroom.startTime)
      formData.append('endTime', this.classroom.endTime)

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
      if (!this.editButtonClicked) {
        this.classroom = { ...this.$store.state.currentlyViewingClass }
      }
      this.showClassInfoModal = false
    },
    streamClass() {
      this.$socket.emit('class_streaming_started', {
        classroomName: this.classroom.name,
        classroomId: this.classroom._id,
        classroomTeacher: this.classroom.createdBy.name
      })

      // console.log(this.classroom)
      // this.$socket.emit('join_class', this.classroom._id)
      this.$store.commit('setCurrentlyViewingClass', {
        currentlyViewingClass: this.classroom
      })
      this.$router.push(`/app/classes/live/${this.classroom._id}`)
    },
    gotoClass() {
      this.$router.push(`/app/classes/live/${this.classroom._id}`)
      if (this.isClassroomCreator) {
        this.$socket.emit('join_class', {
          classroomId: this.classroom._id,
          userId: this.$store.state.user._id
        })
      }
    }
  },
  mounted() {
    this.classroom = { ...this.$store.state.currentlyViewingClass }
    if (this.classroom.createdBy._id === this.$store.state.user._id) {
      this.isClassroomCreator = true
    }
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
.class-action-buttons-wrapper {
  padding: 8px 12px;
  margin-top: 2rem;

  p {
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 1rem;
  }
}
</style>