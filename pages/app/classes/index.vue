<template>
  <div id="main-classroom">
    <div class="classes-overlay" :class="{ darken: showCreateClassForm }">
      <div class="search-classes">
        <form @submit.prevent>
          <SearchIcon v-if="searchIconVisible" />
          <input
            @focus="searchIconVisible = false"
            @blur="searchIconVisible = true"
            type="text"
            name="search"
            id="search"
            v-model="searchText"
            onchange="searchClass"
          />
        </form>
        <button
          v-if="!showCreateClassForm"
          @click="showCreateClassForm = !showCreateClassForm"
        >
          Create a Class
        </button>
      </div>

      <!-- If there are results, show them -->
      <div v-if="!isLoading">
        <div class="available-classes" v-if="searchResults.length > 0">
          <ClassCard
            v-for="availableClass in searchResults"
            :key="availableClass.id"
            class="class-card"
            :courseclass="availableClass"
            @classroomClicked="showClassInfoModal"
          />
        </div>

        <div v-else>
          <p>No classes available</p>
        </div>
      </div>
      <div v-else class="spinner-wrapper">
        <Spinner />
      </div>
      <!-- <ClassCard /> -->
    </div>

    <!-- Create new class form -->
    <div class="create-class-wrapper" v-if="showCreateClassForm">
      <form @submit.prevent="createClass">
        <div class="form-input">
          <label for="className">Name</label>
          <input
            v-model="newClass.name"
            type="text"
            name="className"
            id="className"
          />
        </div>
        <div class="form-input">
          <label for="classBackgroundImage">Image</label>
          <input
            @change="onFileChanged"
            type="file"
            accept="image/*"
            name="classBackgroundImage"
            id="classBackgroundImage"
          />
        </div>
        <div class="form-input">
          <label for="classShortInfo">Short Info</label>
          <input
            v-model="newClass.shortInfo"
            type="text"
            name="shortInfo"
            id="shortInfo"
          />
        </div>
        <div class="form-input">
          <label for="classroomDescription">Description</label>
          <textarea
            rows="6"
            v-model="newClass.description"
            type="text"
            name="classroomDescription"
            id="classroomDescription"
          ></textarea>
        </div>
        <div class="classroom-timeschedule">
          <vue-timepicker
            v-model="newClass.startTime"
            format="hh:mm A"
          ></vue-timepicker>
          <vue-timepicker
            v-model="newClass.endTime"
            format="hh:mm A"
          ></vue-timepicker>
        </div>

        <div>
          <button type="submit">Create</button>
          <button
            :disabled="formSubmitting"
            @click="showCreateClassForm = false"
          >
            Close
          </button>
        </div>
      </form>
    </div>
    <!-- Create new class form ends here -->

    <!-- Modal that contains additional classroom information -->
    <div v-if="isShowingClassInfoModal" class="class-modal-wrapper">
      <ClassInfoModal
        @joinNewClass="joinNewClass"
        @leaveClass="leaveClass"
        @editClass="editClass"
        :classroom="currentlyOpenClass"
        @hideModal="hideTheModal"
        teaching="false"
        hideJoinButton="false"
        allowDirectEdit="false"
      />
    </div>
  </div>
</template>

<script>
import ClassCard from '~/components/ClassCard'
import ClassInfoModal from '~/components/DashboardComponents/ClassInfoModal'
import Spinner from '@/components/Spinner'

// Vue time picker
import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'

// Icons
import SearchIcon from '~/static/Icons/search.svg?inline'

export default {
  components: {
    ClassCard,
    ClassInfoModal,
    VueTimepicker,
    SearchIcon,
    Spinner
  },
  data() {
    return {
      searchIconVisible: true,
      newClass: {
        name: '',
        description: '',
        createdBy: '',
        shortInfo: '',
        startTime: '',
        endTime: ''
      },
      formSubmitting: false,
      classBackgroundImage: null,
      showCreateClassForm: false,
      searchText: '',
      classes: [],
      currentlyOpenClassId: '',
      currentlyOpenClass: {},
      isShowingClassInfoModal: false,
      isLoading: true
    }
  },
  computed: {
    searchResults() {
      return this.classes.filter(
        courseClass =>
          courseClass.name
            .toLowerCase()
            .includes(this.searchText.toLowerCase()) ||
          courseClass.description
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
      )
    }
  },
  methods: {
    async createClass() {
      this.formSubmitting = true
      if (
        this.newClass.name === '' ||
        this.newClass.description === '' ||
        this.newClass.shortInfo === ''
      ) {
        this.$toast.open({
          type: 'error',
          message: 'Please fill all the fields first.',
          position: 'top-right',
          duration: 1500
        })
        return false
      } else if (
        this.newClass.startTime === '' ||
        this.newClass.endTime === ''
      ) {
        return this.$toast.open({
          type: 'error',
          message: 'Please specify start and end time of the class.',
          position: 'top-right',
          duration: false
        })
      }

      this.newClass.createdBy = this.$store.state.user.email

      let formData = new FormData()
      formData.append('name', this.newClass.name)
      formData.append('shortInfo', this.newClass.shortInfo)
      formData.append('createdBy', this.$store.state.user._id)
      formData.append('description', this.newClass.description)
      formData.append('image', this.classBackgroundImage)
      formData.append('startTime', this.newClass.startTime)
      formData.append('endTime', this.newClass.endTime)

      const response = await this.$store.dispatch('createNewClass', formData)
      const { error, payload, message } = response.data
      if (error) {
        this.$toast.open({
          type: 'error',
          message,
          position: 'top-right',
          duration: 1500
        })
      } else {
        this.classes.push(payload.result)
        this.$toast.open({
          type: 'success',
          message: 'Class successfully created.',
          position: 'top-right',
          duration: 1500
        })
      }
      this.formSubmitting = false
      this.showCreateClassForm = false
    },
    onFileChanged(e) {
      this.classBackgroundImage = e.target.files[0]
    },
    async fetchAllClasses() {
      const response = await this.$store.dispatch('fetchAllClasses')
      this.classes = response.data.payload.classes
      this.isLoading = false
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
    async joinNewClass(classId) {
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
        this.fetchAllClasses() // refetch all updated classes
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
    },
    async leaveClass(classId) {
      const response = await this.$store.dispatch('leaveClass', {
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
        this.fetchAllClasses() // refetch all updated classes
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
        this.fetchAllClasses()
        this.$forceUpdate()
        this.hideTheModal(true)
      }
    }
  },
  created() {
    this.fetchAllClasses()
    // if  the use presses escape key, emit the event to close the modal
    // stackoverflow ftw
  },
  mounted() {
    const that = this
    document.onkeydown = function(evt) {
      evt = evt || window.event
      var isEscape = false
      if ('key' in evt) {
        isEscape = evt.key === 'Escape' || evt.key === 'Esc'
      } else {
        isEscape = evt.keyCode === 27
      }
      if (isEscape) {
        that.showCreateClassForm = false
      }
    }
  },
  sockets: {
    connect: function() {}
  }
}
</script>

<style lang="scss" scoped>
.spinner-wrapper {
  height: 75%;
}
.search-classes {
  form {
    position: relative;
    width: 80%;

    input[type='text'] {
      width: 100%;
    }
    svg {
      position: absolute;
      width: 14px;
      height: 14px;
      top: 10px;
      left: 10px;
    }
  }
}
</style>
