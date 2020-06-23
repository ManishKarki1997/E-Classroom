<template>
  <div class="user-profile-container">
    <transition name="fade" mode="out-in">
      <div :key="user._id">
        <div class="user-basic-info">
          <img :src="apiStaticUrl + '/uploads/images/' + user.avatar" alt />
          <h4>{{ user.name }}</h4>
        </div>
        <div class="user-additional-info">
          <p>
            <span>Email</span>
            - {{ user.email }}
          </p>
          <p>
            <span>Contact</span>
            - {{ user.contact }}
          </p>
        </div>
        <div class="user-class-info">
          <div class="user-class-item">
            <h5 v-if="user.joinedClasses">{{ user.joinedClasses.length }}</h5>
            <p>Joined</p>
          </div>
          <div class="user-class-item">
            <h5 v-if="user.createdClasses">{{ user.createdClasses.length }}</h5>
            <p>Teaching</p>
          </div>
        </div>
        <div class="request-action-buttons-wrapper">
          <button @click="emitActionEvent(user._id, 'accept')">Accept</button>
          <button @click="emitActionEvent(user._id, 'reject')">Reject</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ClassIcon from '~/static/Icons/class.svg?inline'
import HugIcon from '~/static/Icons/hug.svg?inline'

export default {
  props: ['user'],
  components: {
    ClassIcon,
    HugIcon
  },
  data() {
    return {
      apiStaticUrl: ''
    }
  },
  mounted() {
    this.apiStaticUrl = process.env.baseUrl
  },
  methods: {
    emitActionEvent(userId, actionType) {
      this.$emit('pendingRequestAction', { userId, actionType })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-profile-container {
  padding: 2rem 1rem;
}
.user-basic-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #434c5e;
    margin-bottom: 8px;
  }
}
.user-additional-info {
  margin-top: 1rem;
  span {
    font-weight: 500;
  }
  p {
    font-size: 14px;
  }
}

.user-class-info {
  display: flex;
  align-items: center;
  margin-top: 1rem;

  .user-class-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--secondary-background-color);
    color: var(--primary-font-color);
    border-radius: 3px;
    padding: 2px 12px;
    margin-right: 8px;

    h5 {
      font-size: 1.4rem;
    }

    p {
      font-size: 12px;
      margin-left: 4px;
    }
  }
}
.request-action-buttons-wrapper {
  display: flex;
  align-items: center;
  margin-top: 1rem;

  button {
    border-radius: 3px;
    padding: 4px 12px;
    cursor: pointer;
  }

  button:first-child {
    background-color: #434c5e;
    border: 1px solid #434c5e;
    color: white;
    margin-right: 8px;
    transition: all 0.3s ease-in-out;

    &:hover {
      background-color: #2d3442;
    }
  }
  button:last-child {
    border: 1px solid #434c5e;
    transition: all 0.3s;

    &:hover {
      color: var(--primary-font-color);
      background-color: transparent;
      // border: none;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
