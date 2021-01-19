<template>
  <div class="announcements-wrapper">
    <div class="announcements" v-if="userAnnouncements.length > 0">
      <div
        class="announcement"
        v-for="announcement in userAnnouncements"
        :key="announcement._id"
        @click="viewNotification(announcement)"
      >
        <div class="image-wrapper">
          <img
            v-if="announcement.classId.backgroundImage"
            :src="
              apiUrl + '/uploads/images/' + announcement.classId.backgroundImage
            "
            alt
          />
          <InfoIcon v-else />
        </div>

        <div class="announcement-content">
          <p class="class-name">{{ announcement.classId.name }}</p>
          <p v-html="announcement.description"></p>
        </div>
      </div>
    </div>
    <div class="not-available" v-else>
      <h4>No Announcements</h4>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Modal from '~/components/Modal'
import InfoIcon from '~/static/Icons/info.svg?inline'

export default {
  components: {
    InfoIcon,
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['apiUrl', 'user']),
    ...mapState(['userAnnouncements']),
  },
  methods: {
    viewNotification(notification) {
      this.$store.commit('setviewNotificationModal', {
        show: true,
        notification: {
          ...notification,
          modalTitle: 'Announcement',
        },
      })
    },
    fetchAnnouncements() {
      this.$store.dispatch('fetchUserAnnouncements', this.user._id)
    },
  },
  mounted() {
    this.fetchAnnouncements()
  },
}
</script>

<style lang="scss" scoped>
.announcements-wrapper {
  .announcements {
    margin: 2rem 0;
    max-height: 80vh;
    overflow-y: auto;

    .announcement {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      border-radius: 3px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;

      &:hover {
        @include hoverBoxShadow;
        // background-color: var(--primary-background-color);
        background-color: #84c1ff;

        .announcement-content {
          color: var(--opposite-font-color);
        }
        .image-wrapper {
          svg {
            stroke: var(--opposite-font-color);
          }
        }
      }

      .image-wrapper {
        margin-right: 1rem;
        margin-top: 4px;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }

      .announcement-content {
        margin-top: -4px;
        font-size: 14px;

        .class-name {
          font-weight: bold;
          margin-bottom: 4px;
        }
      }
    }
  }
}
</style>
