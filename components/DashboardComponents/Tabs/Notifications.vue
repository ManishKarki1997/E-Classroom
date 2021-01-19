<template>
  <div class="notifications-wrapper">
    <div class="notifications" v-if="userNotifications.length > 0">
      <div
        class="notification"
        v-for="notification in userNotifications"
        :key="notification._id"
        @click="viewNotification(notification)"
      >
        <div class="image-wrapper">
          <img
            v-if="notification.image"
            :src="apiUrl + '/uploads/images/' + notification.image"
            alt
          />
          <InfoIcon v-else />
        </div>

        <div class="notification-content">
          <p v-html="notification.title"></p>
        </div>
      </div>
    </div>
    <div class="not-available" v-else>
      <h4>No Notifications</h4>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    ...mapGetters(['apiUrl', 'user', 'userNotifications']),
  },

  methods: {
    viewNotification(notification) {
      this.$store.commit('setviewNotificationModal', {
        show: true,
        notification: {
          ...notification,
          modalTitle: 'Notification',
        },
      })
    },
    fetchNotifications() {
      this.$store.dispatch('fetchNotifications')
    },
  },
  mounted() {
    this.fetchNotifications()
  },
}
</script>

<style lang="scss" scoped>
.notifications-wrapper {
  .notifications {
    margin: 2rem 0;
    max-height: 80vh;
    overflow-y: auto;

    .notification {
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

        .notification-content {
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

      .notification-content {
        margin-top: -4px;
        font-size: 14px;
      }
    }
  }
}
</style>
