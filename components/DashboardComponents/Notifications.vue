<template>
  <div id="notifications">
    <h4 class="section-title">Notifications</h4>
    <div class="notifications">
      <div class="notification" v-for="notification in notifications" :key="notification.id">
        <div class="notification-contents">
          <p class="notification-subject">{{notification.subject}}</p>
          <p class="notification-message">{{notification.notificationMessage}}</p>
          <p class="notification-action">{{notification.action}}</p>
          <p>in</p>
          <p class="notification-classname">{{notification.className}}</p>
        </div>
        <div class="notification-read-icon">
          <MailOpenIcon v-if="notification.notificationRead" />
          <MailClosedIcon v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MailOpenIcon from '~/static/Icons/mailopen.svg?inline'
import MailClosedIcon from '~/static/Icons/mailclosed.svg?inline'

export default {
  components: {
    MailOpenIcon,
    MailClosedIcon
  },
  data() {
    return {
      notifications: [
        {
          id: 'notif001',
          notificationMessage: ' added a new ',
          subject: 'Gilgamesh',
          action: 'file',
          className: 'Web Development',
          notificationRead: false
        },
        {
          id: 'notif002',
          notificationMessage: ' made a new ',
          subject: 'Ishtar',
          action: 'announcement',
          className: 'Mobile App Development',
          notificationRead: false
        },
        {
          id: 'notif003',
          notificationMessage: ' added a new ',
          subject: 'Ishtar',
          action: 'announcement',
          className: 'Mobile App Development',
          notificationRead: false
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
#notifications {
  margin-top: 2rem;
  height: 200px;
  overflow: auto;
  overflow-x: hidden;
}
.notifications {
  margin-top: 6px;

  .notification {
    margin-bottom: 6px;
    background-color: #dddddd;
    padding: 2px 4px;
    border-radius: 2px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;

    p {
      display: inline-block;
      margin: 0;
      font-size: 12px;
      line-height: 18px;
    }
    .notification-read-icon {
      width: 10%;
    }
    .notification-read-icon svg {
      width: 14px;
      height: 14px;
      display: none;
      cursor: pointer;
    }
    &:hover .notification-read-icon svg {
      display: block;
    }
  }
}
</style>