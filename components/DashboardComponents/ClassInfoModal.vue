<template>
  <div class="classroom-modal">
    <div class="classroom-image">
      <img :src="`${apiUrl}/uploads/images/${classroom.backgroundImage}`" alt="Classroom Imge" />
    </div>

    <div class="classroom-info-wrapper">
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
        <button>Join</button>
        <button @click="hideModal">Cancel</button>
      </div>
      <!-- End:  Classroom Join/Close Buttons -->
    </div>
  </div>
</template>

<script>
import ClassIcon from '~/static/Icons/class.svg?inline'
import HugIcon from '~/static/Icons/hug.svg?inline'

export default {
  props: ['classroom'],
  components: {
    ClassIcon,
    HugIcon
  },
  data() {
    return {
      apiUrl: this.$store.state.apiUrl
    }
  },
  created() {
    console.log(this.classroom)
  },
  methods: {
    hideModal() {
      this.$emit('hideModal', true)
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
