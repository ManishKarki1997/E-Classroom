<template>
  <div class="class-info">
    <div class="class-info--left">
      <div class="class-basic-info">
        <h2>{{ currentlyViewingClass.name }}</h2>

        <p class="subtitle">{{ currentlyViewingClass.shortInfo }}</p>

        <p>{{ currentlyViewingClass.description }}</p>
      </div>
      <div class="class-stats">
        <div class="class-stat" @click="goto('students')">
          <h2>{{ currentlyViewingClass.users.length }}</h2>
          <p>Students</p>
        </div>
        <div
          v-if="isUserOwned"
          class="class-stat"
          @click="goto('pending-requests')"
        >
          <h2>{{ currentlyViewingClass.pendingJoinRequests.length }}</h2>
          <p>Pending Requests</p>
        </div>
        <div class="class-stat" @click="goto('resources')">
          <h2>{{ currentlyViewingClass.resourceFolders.length }}</h2>
          <p>Resource Folders</p>
        </div>
      </div>
      <div class="class-schedule">
        <h4>Class Schedule</h4>
        <div class="schedule-time">
          <p>{{ currentlyViewingClass.startTime | formatClassSchedule }}</p>
          <span>-&nbsp;</span>
          <p>{{ currentlyViewingClass.endTime | formatClassSchedule }}</p>
        </div>
      </div>
      <div
        class="leave-class-button-wrapper"
        v-if="!isUserOwned && !isAdmin && hasEnrolledInTheClass"
      >
        <button @click="handleLeaveClass">Leave</button>
      </div>
      <!-- <pre>{{ currentlyViewingClass }}</pre>  -->
    </div>
    <div class="class-info--right">
      <img
        :src="`${apiUrl}/uploads/images/${currentlyViewingClass.backgroundImage}`"
        alt="Class Background Image"
      />
    </div>
    <v-dialog />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  computed: {
    ...mapGetters(['user', 'currentlyViewingClass', 'apiUrl']),
    isUserOwned() {
      if (!this.user) return false
      return this?.user._id === this.currentlyViewingClass?.createdBy?._id
    },
    isAdmin() {
      return this?.user?.userType === 'ADMIN'
    },
    hasEnrolledInTheClass() {
      return this.currentlyViewingClass.users.indexOf(this?.user?._id) > -1
    },
  },
  data() {
    return {}
  },
  methods: {
    handleLeaveClass() {
      this.$modal.show('dialog', {
        title: `Leave Class?`,
        text: `Are you sure you want to leave the class?`,
        buttons: [
          {
            title: 'Cancel',
            handler: () => {
              this.$modal.hide('dialog')
            },
          },

          {
            title: 'Yes',
            handler: () => {
              this.leaveClass()
              this.$modal.hide('dialog')
            },
          },
        ],
      })
    },
    leaveClass() {
      this.$store.dispatch('leaveClass', {
        classId: this.currentlyViewingClass._id,
        userId: this.user._id,
      })
      this.$router.push('/app/classes')
    },
    goto(route) {
      this.$router.push(`/app/class/${this.currentlyViewingClass._id}/${route}`)
    },
  },
  filters: {
    formatClassSchedule(value) {
      if (!value) return ''
      return moment(value, 'hh:mm A').format('hh:mm A')
    },
  },
}
</script>

<style lang="scss" scoped>
.class-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;

  .class-info--left {
    width: 58%;
    padding: 1rem;

    .class-basic-info {
      margin-bottom: 1rem;

      h2 {
        margin-bottom: 8px;
      }
      p {
        margin-bottom: 8px;
      }
    }

    .class-stats {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 1rem;
      .class-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: var(--primary-background-color);
        padding: 8px;
        border-radius: 5px;
        margin-right: 2rem;
        margin-bottom: 2rem;
        min-height: 100px;
        min-width: 200px;
        @include normalBoxShadow;

        &:hover {
          @include hoverBoxShadow;
        }
      }
    }

    .class-schedule,
    .schedule-time {
      display: flex;
      align-items: center;
    }

    .class-schedule {
      h4 {
        margin-right: 1rem;
      }

      .schedule-time {
        p {
          margin-right: 8px;
        }
      }
    }
    .leave-class-button-wrapper {
      margin-top: 2rem;
      button {
        @include primaryButton;
        transition: all 0.3s ease-in-out;

        &:hover {
          background-color: var(--button-background-hover);
        }
      }
    }
  }
  .class-info--right {
    width: 40%;
    max-height: 600px;
    overflow: hidden;
    border-radius: 5px;

    img {
      width: 100%;
      height: 600px;
      object-fit: cover;
      transition: all 0.3s ease-in-out;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>
