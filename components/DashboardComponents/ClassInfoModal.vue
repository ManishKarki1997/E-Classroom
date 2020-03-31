<template>
  <div class="classroom-modal">
    <div class="classroom-image">
      <img
        v-if="!newBackgroundChosen"
        :src="`${apiUrl}/uploads/images/${classroom.backgroundImage}`"
        alt="Classroom Imge"
      />
      <img v-else :src="backgroundImageUrl" alt="Classroom Imge" />
    </div>

    <div v-if="editMode" class="edit-class-wrapper">
      <form @submit.prevent="emitEditEvent">
        <div class="form-input">
          <label for="className">Name</label>
          <input v-model="editClassInfo.name" type="text" name="className" id="className" />
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
          <input v-model="editClassInfo.shortInfo" type="text" name="shortInfo" id="shortInfo" />
        </div>
        <div class="form-input">
          <label for="classroomDescription">Description</label>
          <textarea
            rows="10"
            v-model="editClassInfo.description"
            type="text"
            name="classroomDescription"
            id="classroomDescription"
          ></textarea>
        </div>
        <div class="classroom-timeschedule" style="margin-top:2rem;">
          <label>Time Schedule</label>
          <vue-timepicker v-model="editClassInfo.startTime" format="hh:mm A"></vue-timepicker>
          <vue-timepicker v-model="editClassInfo.endTime" format="hh:mm A"></vue-timepicker>
        </div>

        <div class="edit-class-buttons">
          <button type="submit">Edit</button>
          <button @click="editMode=false">Close</button>
        </div>
      </form>
    </div>

    <div class="classroom-info-wrapper" v-else>
      <div class="teacher-info-wrapper">
        <img :src="`${apiUrl}/uploads/images/${classroom.createdBy.avatar}`" alt="Teacher Imge" />
        <div class="teacher-info">
          <h5>{{classroom.createdBy.name}}</h5>
          <p>{{classroom.createdBy.createdClasses.length}} classes</p>
        </div>
      </div>

      <!-- Start:  Classroom Info -->
      <div class="classroom-details">
        <h4>{{classroom.name}}</h4>
        <p>{{classroom.shortInfo}}</p>
        <p class="classroom-description">{{classroom.description}}</p>
      </div>
      <!-- End:  Classroom Info -->

      <!-- Start:  Classroom Users Info -->
      <div class="user-meta">
        <div class="user-meta-item">
          <ClassIcon />
          <div class="user-meta-info">
            <h5>{{classroom.users.length}}</h5>
            <p>Enrolled</p>
          </div>
        </div>
        <div class="user-meta-item">
          <HugIcon />
          <div class="user-meta-info">
            <h5>{{classroom.pendingJoinRequests.length}}</h5>
            <p>Interested</p>
          </div>
        </div>
      </div>
      <!-- End:  Classroom Users Info -->

      <!-- Start : Classroom Time Schedule -->
      <div class="classroom-time-schedule">
        <p>Time Schedule</p>
        <p>
          <span>{{classroom.startTime}}</span> -
          <span>{{classroom.endTime}}</span>
        </p>
      </div>
      <!-- End : Classroom Time Schedule -->

      <!-- Start:  Classroom Join/Close Buttons -->
      <div class="classroom-action-buttons">
        <button :disabled="formSubmitting" v-if="showJoinButton" @click="emitJoinEvent">Join</button>
        <button v-if="showEditButton" @click="editMode=true">Edit</button>
        <button
          :disabled="formSubmitting"
          v-if="!showJoinButton && showLeaveButton"
          @click="emitLeaveClassEvent"
        >Leave</button>
        <button @click="hideModal">Close</button>
      </div>
      <!-- End:  Classroom Join/Close Buttons -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import ClassIcon from '~/static/Icons/class.svg?inline'
import HugIcon from '~/static/Icons/hug.svg?inline'

// Vue time picker
import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'

export default {
  props: ['classroom', 'teaching', 'hideJoinButton'],
  components: {
    ClassIcon,
    HugIcon,
    VueTimepicker
  },
  computed: mapState({
    user: state => state.user
  }),
  data() {
    return {
      apiUrl: this.$store.state.apiUrl,
      editClassInfo: {},
      formSubmitting: false,
      classBackgroundImage: null,
      newBackgroundChosen: false,
      backgroundImageUrl: '',
      userCreatedThisClass: false,
      showLeaveButton: false,
      showJoinButton: false,
      showEditButton: false,
      editMode: false
    }
  },
  methods: {
    hideModal() {
      this.$emit('hideModal', true)
    },
    emitJoinEvent() {
      this.$emit('joinNewClass', this.classroom._id)
    },
    emitEditEvent() {
      this.$emit('editClass', this.classBackgroundImage)
    },
    onFileChanged(e) {
      this.classBackgroundImage = e.target.files[0]
      this.newBackgroundChosen = true
      this.backgroundImageUrl = URL.createObjectURL(this.classBackgroundImage)
    },
    emitLeaveClassEvent() {
      this.$emit('leaveClass', this.classroom._id)
    }
  },
  mounted() {
    this.editClassInfo = this.classroom

    // check if current user joined this classroom & the classroom wasn't created by this user
    const userCreatedThisClass =
      this.user._id === this.classroom.createdBy._id ? true : false
    const userAlreadyJoinedClass =
      this.classroom.users.indexOf(this.user._id) > -1 ? true : false

    if (!userCreatedThisClass && !userAlreadyJoinedClass) {
      this.showJoinButton = true
    }

    if (userAlreadyJoinedClass && !userCreatedThisClass) {
      this.showLeaveButton = true
    }

    if (this.classroom.createdBy._id === this.user._id) {
      this.showEditButton = true
    }

    // if  the use presses escape key, emit the event to close the modal
    // stackoverflow ftw
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
        that.hideModal()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/_base';
.edit-class-wrapper {
  width: 60%;
  padding: 1.5rem 3rem;

  textarea {
    background-color: inherit;
    color: inherit;
    border: none;
    overflow: auto;
    margin-top: 12px;
  }

  .time-picker input {
    background-color: inherit;
    color: inherit;
  }

  .edit-class-buttons {
    margin-top: 3rem;

    button {
      &:first-child {
        background-color: #434c5e;
        color: white;
      }
    }
  }
}
</style>
