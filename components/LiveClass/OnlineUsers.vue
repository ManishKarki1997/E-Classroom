<template>
  <div class="online-users-wrapper">
    <h3>Online Users</h3>

    <ul class="online-users">
      <li
        class="online-user"
        v-for="onlineUser in onlineUsers"
        :key="onlineUser.email"
      >
        <div class="user-info" v-if="onlineUser.email !== undefined">
          <div class="user-avatar-wrapper">
            <img
              :src="apiUrl + '/uploads/images/' + onlineUser.avatar"
              alt="User Image"
            />
          </div>
          <h4>{{ onlineUser.name }}</h4>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      onlineUsers: [],
    }
  },
  computed: {
    ...mapGetters(['apiUrl']),
  },
  sockets: {
    class_active_users(users) {
      this.onlineUsers = users
    },
  },
}
</script>

<style lang="scss" scoped>
.online-users-wrapper {
  padding: 1rem;
  background-color: var(--primary-background-color);
  @include normalBoxShadow;
  .online-users {
    margin-top: 1rem;
    .online-user {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .user-info {
        display: flex;
        align-items: center;
        .user-avatar-wrapper {
          margin-right: 8px;
          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>
