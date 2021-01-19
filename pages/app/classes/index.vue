<template>
  <div v-if="user">
    <div class="create-class-wrapper">
      <div class="form-wrapper">
        <div class="form-input">
          <SearchIcon />
          <input
            placeholder="Search classes"
            type="text"
            v-model="searchText"
            name="searchText"
            id="searchText"
          />
        </div>
        <div class="form-button" v-if="user.userType === 'TEACHER'">
          <button @click="gotoCreateClassPage">Create a Class</button>
        </div>
      </div>
    </div>
    <transition-group tag="div" name="slide-fade" class="classes">
      <ClassCard
        v-for="availableClass in searchResults"
        :key="availableClass._id"
        class="class-card"
        :courseclass="availableClass"
        @classroomClicked="viewClassInfo"
      />
    </transition-group>

    <Modal class="create-class-modal-wrapper" v-if="showClassInfoModal">
      <template slot="header">
        <div class="modal-header">
          <!-- <h2>{{ selectedClass.name }}</h2> -->
          <CloseIcon />
        </div>
      </template>
      <template slot="body">
        <div class="modal-background-wrapper">
          <div class="modal-content-wrapper">
            <CloseIcon @click="closeViewClassInfoModal" class="close-icon" />
            <div class="modal-body">
              <div class="selected-class-image-wrapper">
                <img
                  :src="`${apiUrl}/uploads/images/${selectedClass.backgroundImage}`"
                  alt="Selected Class Image"
                />
              </div>
              <div class="selected-class-info-wrapper">
                <div class="teacher-info-wrapper">
                  <img
                    :src="`${apiUrl}/uploads/images/${selectedClass.createdBy.avatar}`"
                    alt="Teacher Image"
                  />
                  <div class="teacher-info">
                    <h3>{{ selectedClass.createdBy.name }}</h3>
                    <p class="subtitle">
                      {{ selectedClass.createdBy.createdClasses.length }}
                      classes
                    </p>
                  </div>
                </div>

                <!-- Start:  selectedClass Info -->
                <div class="selectedClass-details">
                  <h3>{{ selectedClass.name }}</h3>
                  <p class="class-short-info">{{ selectedClass.shortInfo }}</p>
                  <p class="selectedClass-description">
                    {{ selectedClass.description }}
                  </p>
                </div>
                <div class="selectedClass-time-schedule">
                  <p>Time Schedule</p>
                  <p>
                    <span>
                      {{ selectedClass.startTime | formatClassSchedule }}
                    </span>
                    -
                    <span>
                      {{ selectedClass.endTime | formatClassSchedule }}
                    </span>
                  </p>
                </div>

                <!-- Start : selectedClass Time Schedule -->
                <!-- End : selectedClass Time Schedule -->

                <!-- Start:  selectedClass Join/Close Buttons -->
                <div class="selectedClass-action-buttons">
                  <!-- <button @click="editMode=true">Edit</button> -->
                  <button
                    :disabled="isLoading"
                    v-if="
                      !isEnrolledInClass &&
                      !isPendingRequestInClass &&
                      !isClassOwner
                    "
                    @click="joinClass"
                  >
                    Join
                  </button>

                  <button v-if="isPendingRequestInClass">
                    Pending Request
                  </button>
                  <!-- <button v-if="showViewButton" @click="gotoSingleClassView">View</button> -->
                  <button @click="gotoSingleClassView">View</button>

                  <!-- <button v-if="showAttendButton" @click="attendClass">Attend</button> -->
                  <button v-if="isEnrolledInClass" @click="handleLeaveClass">
                    Leave
                  </button>
                  <!-- <button
                    :disabled="formSubmitting"
                    v-if="
                      selectedClass.users.indexOf(user._id) > -1 &&
                      selectedClass.createdBy._id !== user._id
                    "
                    @click="emitLeaveEvent"
                  >
                    Leave
                  </button>-->
                  <!-- <button @click="hideModal">Close</button> -->
                </div>
                <!-- End:  selectedClass Join/Close Buttons -->
              </div>
              <!-- <pre>{{ selectedClass }}</pre> -->
            </div>
          </div>
        </div>
      </template>
    </Modal>
    <v-dialog />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchIcon from '~/static/Icons/search.svg?inline'
import ClassCard from '~/components/ClassCard'
import CloseIcon from '~/static/Icons/x-circle.svg?inline'
import Modal from '~/components/Modal'
import moment from 'moment'

export default {
  components: {
    ClassCard,
    SearchIcon,
    CloseIcon,
    Modal,
  },
  data() {
    return {
      isLoading: false,
      searchText: '',
      selectedClass: null,
      showClassInfoModal: false,
      editMode: false,
    }
  },
  computed: {
    ...mapGetters(['allClasses', 'user', 'apiUrl']),
    searchResults() {
      return this.allClasses.filter(
        (courseClass) =>
          courseClass.name
            .toLowerCase()
            .includes(this.searchText.toLowerCase()) ||
          courseClass.description
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
      )
    },
    isEnrolledInClass() {
      return this.selectedClass.users.includes(this.user._id)
    },
    isClassOwner() {
      return this.selectedClass.createdBy._id === this.user._id
    },
    isPendingRequestInClass() {
      return this.selectedClass.pendingJoinRequests.includes(this.user._id)
    },
  },
  methods: {
    joinClass() {
      this.isLoading = true
      this.$store.dispatch('joinNewClass', {
        classId: this.selectedClass._id,
        userId: this.user._id,
      })
      this.isLoading = false
      setTimeout(() => {
        this.showClassInfoModal = false
      }, 1000)
      this.fetchAllClasses()
    },
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
        classId: this.selectedClass._id,
        userId: this.user._id,
      })
      setTimeout(() => {
        this.showClassInfoModal = false
      }, 1000)
    },
    closeViewClassInfoModal() {
      this.showClassInfoModal = false
    },
    viewClassInfo(selectedClass) {
      this.selectedClass = selectedClass
      this.showClassInfoModal = true
    },
    gotoSingleClassView() {
      this.$store.commit('setCurrentlyViewingClass', this.selectedClass)
      this.$router.push(`/app/class/${this.selectedClass._id}/info`)
      this.$socket.emit('JOIN_CLASS_CHAT', {
        classId: this.selectedClass._id,
        userId: this.user._id,
      })
    },
    gotoCreateClassPage() {
      this.$router.push('/app/classes/create')
    },
    onFileChanged(e) {
      this.classBackgroundImage = e.target.files[0]
    },
    fetchAllClasses() {
      this.$store.dispatch('fetchAllClasses')
    },
    closeModal() {
      this.showClassInfoModal = false
      this.showCreateNewClassModal = false
    },
  },
  mounted() {
    this.fetchAllClasses()

    // document.onkeydown = (evt) => {
    //   evt = evt || window.event
    //   var isEscape = false
    //   if ('key' in evt) {
    //     isEscape = evt.key === 'Escape' || evt.key === 'Esc'
    //   } else {
    //     isEscape = evt.keyCode === 27
    //   }
    //   if (isEscape) {
    //     this.closeModal()
    //   }
    // }
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
.classes {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 2rem;
  margin-top: 2rem;
}

.create-class-wrapper {
  width: 50%;

  .form-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    .form-input {
      position: relative;
      svg {
        position: absolute;
        top: 20px;
        left: 20px;
        width: 24px;
        height: 24px;
      }
      margin-right: 8px;
      width: 70%;
      input {
        padding: 16px 12px 16px 48px;
        background-color: var(--primary-background-color);
        outline: none;
      }
    }
    .form-button button {
      @include primaryButton;
      @include normalBoxShadow;
    }
  }
}

.create-class-modal-wrapper {
  background-color: rgba(0, 0, 0, 0.01);

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal-body {
    padding: 0;
    display: flex;
    min-height: 500px;
    .modal-content-wrapper {
      position: relative;
      background-color: var(--primary-background-color);

      .close-icon {
        position: absolute;
        right: 8px;
        top: 8px;
      }
    }

    .selected-class-image-wrapper {
      width: 40%;
      min-height: 500px;

      img {
        width: 100%;
        height: 100%;
      }
    }
    .selected-class-info-wrapper {
      width: 60%;
      padding: 2rem;

      .teacher-info-wrapper {
        display: flex;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .teacher-info {
          margin-left: 8px;
        }
      }

      .selectedClass-details {
        margin: 1rem 0;

        h3 {
          margin-bottom: 8px;
        }

        .class-short-info {
          font-style: italic;
          margin-bottom: 8px;
        }
      }

      .selectedClass-time-schedule {
        margin-bottom: 1rem;

        p span {
          font-size: 18px;
          font-weight: bold;
        }
      }
    }

    .selectedClass-action-buttons {
      button {
        &:first-child {
          @include primaryButton;
        }
        &:nth-child(2) {
          @include secondaryButton;
        }
      }
    }

    .selectedClass-timeschedule {
      display: flex;
      flex-direction: column;
      margin-left: 8px;

      .time-wrappers {
        margin-top: 8px;
        margin-bottom: 8px;

        input[type='time'] {
          margin-right: 8px;
          padding: 8px;
        }
      }
    }
  }
}
</style>
