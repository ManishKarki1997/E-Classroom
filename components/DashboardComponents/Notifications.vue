<template>
  <div id="notifications">
    <h4 class="section-title">Notifications</h4>
    <div class="notifications">
      <div
        class="notification"
        v-for="(notification,index) in notifications"
        :key="notification.id"
      >
        <div class="notification-dot" :style="{backgroundColor:colors[index]}"></div>
        <p class="notification-message">{{notification.notificationMessage}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      colors: [
        '#005691',
        '#9896f1',
        '#fbe1b6',
        '#74f9ff',
        '#bad7df',
        '#ffbd39',
        '#f73859',
        '#39065a',
        '#45eba5'
      ],
      notifications: [
        {
          id: 'notif001',
          notificationMessage:
            'Gilgamesh has added a new file in Web Development',

          notificationRead: false
        },
        {
          id: 'notif002',
          notificationMessage:
            'Ishtar has made a new announcement in Mobile App Development',

          notificationRead: false
        },
        {
          id: 'notif003',
          notificationMessage:
            'Ishtar has added a new announcement in Mobile App Development',

          notificationRead: false
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
#notifications {
  // margin-top: 2rem;
  // min-height: 100px;
  overflow: auto;
  overflow-x: hidden;
  background-color: var(--secondary-background-color);

  h4 {
    margin-bottom: 12px;
  }
}

.notifications {
  margin-top: 6px;

  .notification {
    margin-bottom: 6px;
    // background-color: #dddddd;

    padding: 2px 4px;
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    // align-items: flex-start;
    justify-content: space-between;

    p {
      font-size: 12px;
      line-height: 18px;
    }
  }
  .notification-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-top: 4px;
    margin-right: 8px;
  }
}
</style>