<template>
  <div>
    <div class="create-class-wrapper">
      <div class="form-wrapper">
        <div class="form-input">
          <SearchIcon />
          <input
            type="text"
            v-model="searchText"
            placeholder="Search classes"
            name="searchText"
            id="searchText"
          />
        </div>
        <!-- <div class="form-button">
          <button @click="gotoCreateClassPage">Create a Class</button>
        </div>-->
      </div>
    </div>
    <transition-group
      v-if="searchResults.length > 0"
      class="classes"
      tag="div"
      name="slide-fade"
    >
      <ClassCard
        v-for="availableClass in searchResults"
        :key="availableClass._id"
        class="class-card"
        :courseclass="availableClass"
        @classroomClicked="viewClassInfo"
      />
    </transition-group>

    <div v-if="allClasses.length == 0">
      <p>No classes available</p>
    </div>

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
                    v-if="
                      !isEnrolledInClass &&
                      !isPendingRequestInClass &&
                      !isClassOwner &&
                      !isAdmin
                    "
                    @click="joinClass"
                  >
                    Join
                  </button>

                  <button v-if="isPendingRequestInClass">
                    Pending Request
                  </button>

                  <button v-if="!isAdmin" @click="gotoSingleClassView">
                    View
                  </button>
                  <button
                    @click="handleMakeClassPublicOrPrivate"
                    v-if="isAdmin || isClassOwner"
                  >
                    Toggle Visibility
                  </button>

                  <button v-if="isEnrolledInClass" @click="leaveClass">
                    Leave
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>

    <Modal
      v-if="showMakeClassPublicPrivateModal"
      @closeModal="showMakeClassPublicPrivateModal = false"
    >
      <template slot="header">Toggle Class Visibility</template>
      <template slot="body">
        <form @submit.prevent="makeClassPrivateOrPublic">
          <div class="form-input">
            <label for="reason">Reason</label>
            <input type="text" name="reason" id="reason" v-model="reason" />
          </div>
        </form>
      </template>

      <template slot="footer">
        <button type="submit" @click="makeClassPrivateOrPublic">Toggle</button>
        <button @click="showMakeClassPublicPrivateModal = false">Cancel</button>
      </template>
    </Modal>

    <v-dialog />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
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
      searchText: '',
      selectedClass: null,
      showClassInfoModal: false,
      showMakeClassPublicPrivateModal: false,
      reason: '',
      editMode: false,
    }
  },
  computed: {
    ...mapGetters(['allClasses', 'user', 'apiUrl']),
    isAdmin() {
      return this.user.userType === 'ADMIN'
    },
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
    handleMakeClassPublicOrPrivate() {
      const result = this.selectedClass.private ? 'public' : 'private'
      this.$modal.show('dialog', {
        title: `Set class as  ${result}?`,
        text: `Are you sure you want to set the class to ${result}?`,
        buttons: [
          {
            title: 'Cancel',
            handler: () => {
              this.$modal.hide('dialog')
              this.showMakeClassPublicPrivateModal = false
            },
          },

          {
            title: 'Yes',
            handler: () => {
              this.showMakeClassPublicPrivateModal = true
              this.$modal.hide('dialog')
            },
          },
        ],
      })
    },
    makeClassPrivateOrPublic() {
      if (!this.reason) {
        return this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Please provide a valid reason for this action',
          type: 'danger',
          dismissAfter: 3000,
        })
      }
      if (this.isAdmin) {
        this.$store.dispatch('makeClassPublicOrPrivate', {
          reason: this.reason,
          classId: this.selectedClass._id,
          userId: this.user._id,
        })
        this.reason = ''
      } else {
        console.log('teacher making the class private')
      }
      this.showMakeClassPublicPrivateModal = false
    },
    joinClass() {
      this.$store.dispatch('joinNewClass', {
        classId: this.selectedClass._id,
        userId: this.user._id,
      })
      this.fetchAllClasses()
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
      console.log(selectedClass)
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
    // gotoCreateClassPage() {
    //   this.$router.push('/app/classes/create')
    // },
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
        top: 17px;
        left: 17px;
        width: 20px;
        height: 20px;
      }
      margin-right: 8px;
      width: 70%;
      input {
        padding: 8px 12px 8px 32px;
      }
    }
    .form-button button {
      @include primaryButton;
    }
  }
}

.create-class-modal-wrapper {
  // background-color: rgba(0, 0, 0, 0.01);

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
      background-color: var(--primary-background-color) !important;

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
        margin-bottom: 2rem;

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
          margin-bottom: 1rem;
        }

        .class-short-info {
          font-style: italic;
          margin-bottom: 1rem;
        }
      }

      .selectedClass-time-schedule {
        margin: 2rem 0;

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
