<template>
  <div id="notifications">
    <h4 class="section-title">Notifications</h4>
    <!-- <pre>{{notifications}}</pre> -->
    <div v-if="notifications && notifications.length>0" class="notifications">
      <div
        class="notification"
        v-for="(notification,index) in notifications.slice(0,5)"
        :key="notification._id"
      >
        <div class="notification-dot" :style="{backgroundColor:colors[index]}"></div>
        <p class="notification-message">{{notification.title}}</p>
      </div>
    </div>
    <p v-else>No Notifications</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

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
      ]
    }
  },
  computed: {
    ...mapGetters({
      notifications: 'getNotifications'
    })
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
    display: flex;

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