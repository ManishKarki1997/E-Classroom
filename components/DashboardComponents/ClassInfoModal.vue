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

    <div v-if="teaching" class="edit-class-wrapper">
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
          <input type="submit" value="Edit" />
          <button :disabled="formSubmitting" @click="hideModal">Close</button>
        </div>
      </form>
    </div>

    <div class="classroom-info-wrapper" v-if="!teaching">
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
        <button v-if="!hideJoinButton && !teaching" @click="emitJoinEvent">Join</button>
        <button v-if="teaching" @click="emitEditEvent">Edit</button>
        <button @click="hideModal">Cancel</button>
      </div>
      <!-- End:  Classroom Join/Close Buttons -->
    </div>
  </div>
</template>

<script>
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
  data() {
    return {
      apiUrl: this.$store.state.apiUrl,
      editClassInfo: {},
      formSubmitting: false,
      classBackgroundImage: null,
      newBackgroundChosen: false,
      backgroundImageUrl: ''
    }
  },
  created() {
    // console.log(this.classroom)
    this.editClassInfo = this.classroom
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
    }
  },
  mounted() {
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
  width: 75%;
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
  }
}
</style>
