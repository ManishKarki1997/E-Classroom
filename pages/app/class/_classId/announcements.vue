<template>
  <div id="class-announcements-page">
    <div class="class-top-header">
      <h3>Announcements</h3>
      <div class="make-announcement-button-wrapper" v-if="isTeacher">
        <button @click="handleMakingAnnouncement">
          <PlusIcon />Announce
        </button>
      </div>
    </div>
    <div class="announcements-wrapper">
      <!-- <pre>{{currentClassAnnouncements}}</pre> -->
      <div class="announcements" v-if="currentClassAnnouncements.length>0">
        <div
          class="announcement"
          v-for="announcement in currentClassAnnouncements"
          :key="announcement._id"
          @click="setSelectedAnnouncement(announcement)"
        >
          <div class="announcement--left">
            <div class="announcement-icon-wrapper">
              <ActivityIcon />
            </div>
            <div class="announcement--right">
              <h3>{{announcement.title.slice(0,50)}}</h3>
              <p>{{announcement.description.slice(0,100)}}</p>
              <p class="subtitle">{{announcement.createdAt | formatDate}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="not-available" v-else>
        <p>No announcements made</p>
      </div>
    </div>

    <Modal
      v-if="showMakeAnnouncementModal"
      class="make-announcement-modal"
      @closeModal="closeMakeAnnouncementModal"
    >
      <template slot="header">
        <h4>Create an announcement</h4>
      </template>

      <template slot="body">
        <form @submit.prevent="makeAnAnnouncement">
          <div class="form-input">
            <label for="title">Title</label>
            <input type="text" name="title" id="title" v-model="announcement.title" />
          </div>

          <div class="form-input">
            <label for="description">Description</label>
            <input
              type="text"
              name="description"
              id="description"
              v-model="announcement.description"
            />
          </div>

          <div class="form-buttons">
            <button type="submit">Announce!</button>
            <button @click="closeMakeAnnouncementModal">Cancel</button>
          </div>
        </form>
      </template>
    </Modal>

    <Modal v-if="showViewAnnouncementModal" @closeModal="closeViewAnnouncementModal">
      <template slot="header">
        <h4>View Announcement</h4>
      </template>

      <template slot="body">
        <h2>{{selectedAnnouncement.title}}</h2>
        <p class="content-text">{{selectedAnnouncement.description}}</p>
        <p class="subtitle">{{selectedAnnouncement.createdAt}}</p>
      </template>

      <template slot="footer">
        <button @click="closeViewAnnouncementModal">Close</button>
      </template>
    </Modal>
  </div>
</template>

<script>
import PlusIcon from '~/static/Icons/plus.svg?inline'
import ActivityIcon from '~/static/Icons/activity.svg?inline'
import Modal from '~/components/Modal'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  components: {
    PlusIcon,
    ActivityIcon,
    Modal,
  },
  data() {
    return {
      showMakeAnnouncementModal: false,
      showViewAnnouncementModal: false,
      selectedAnnouncement: null,
      announcement: {
        title: '',
        description: '',
        userId: '',
        classId: '',
      },
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'currentlyViewingClass',
      'currentClassAnnouncements',
    ]),
    isTeacher() {
      return this.currentlyViewingClass.createdBy._id === this.user._id
    },
  },
  methods: {
    setSelectedAnnouncement(announcement) {
      this.selectedAnnouncement = announcement
      this.showViewAnnouncementModal = true
    },
    closeViewAnnouncementModal() {
      this.selectedAnnouncement = null
      this.showViewAnnouncementModal = false
    },
    closeMakeAnnouncementModal() {
      this.showMakeAnnouncementModal = false
      this.announcement.title = ''
      this.announcement.description = ''
      this.announcement.userId = ''
      this.announcement.classId = ''
    },
    handleMakingAnnouncement() {
      this.showMakeAnnouncementModal = true
    },
    makeAnAnnouncement() {
      if (
        this.announcement.title.trim() === '' ||
        this.announcement.description.trim() === ''
      ) {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Please provide the title of the announcement',
          type: 'danger',
          dismissAfter: 3000,
        })
        return
      }

      this.announcement.userId = this.user._id
      this.announcement.classId = this.currentlyViewingClass._id
      this.$store.dispatch('makeAnAnnouncement', this.announcement)

      setTimeout(() => {
        this.showMakeAnnouncementModal = false
      }, 1000)
    },
    fetchAnnouncements() {
      this.$store.dispatch('fetchAnnouncements', this.currentlyViewingClass._id)
    },
  },
  mounted() {
    this.fetchAnnouncements()
  },
  filters: {
    formatDate(value) {
      if (!value) return value

      return moment(value).format('yyyy-MM-DD')
    },
  },
}
</script>


<style lang="scss" scoped>
#class-announcements-page {
  .make-announcement-button-wrapper {
    button {
      display: flex;
      align-items: center;
      svg {
        margin-right: 8px;
      }
      @include primaryButton;
      transition: all 0.3s ease-in-out;
      &:hover {
        background-color: var(--button-background-hover);
      }
    }
  }

  .announcements-wrapper {
    margin-top: 2rem;
    padding: 1rem;

    .announcements {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-gap: 2rem;

      .announcement {
        grid-column: span 4;
        display: flex;
        align-items: center;
        border-radius: 5px;
        padding: 1rem;
        margin-bottom: 1rem;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        background-color: var(--primary-background-color);
        @include normalBoxShadow;

        &:hover {
          @include hoverBoxShadow;

          .announcement--left {
            .announcement-icon-wrapper {
              svg {
                stroke: var(--accent-background-color);
              }
            }
          }

          .announcement--right {
            h3 {
              color: var(--accent-background-color);
            }
          }
        }

        .announcement--left {
          min-width: 25%;
          display: flex;
          align-items: center;
          justify-content: center;
          .announcement-icon-wrapper {
            padding: 1rem;
          }
        }
        .announcement--right {
          margin-left: 1rem;

          h3,
          p {
            margin-bottom: 4px;
          }
        }
      }
    }
  }

  .make-announcement-modal {
    .form-buttons {
      button {
        &:first-child {
          @include primaryButton;
          transition: all 0.3s ease-in-out;
          &:hover {
            background-color: var(--button-background-hover);
          }
        }

        &:nth-child(2) {
          @include tertiaryButton;
          margin-left: 1rem;
        }
      }
    }
  }
}
</style>