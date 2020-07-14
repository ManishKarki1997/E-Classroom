<template>
  <div class="user-profile-wrapper">
    <div class="user-profile">
      <div class="user-avatar-wrapper">
        <img :src="apiStaticUrl + '/uploads/images/' + user.avatar" alt="User Picture" />
      </div>
      <h4>{{ user.name }}</h4>
      <!-- <p>Student</p> -->
    </div>
    <div class="user-meta-wrapper">
      <div class="user-meta-info">
        <h5>{{ user.createdClasses.length }}</h5>
        <p>Teaching</p>
      </div>

      <div class="user-meta-info">
        <h5>{{ user.joinedClasses.length }}</h5>
        <p>Enrolled</p>
      </div>
    </div>
  </div>
</template>

<script>
import ClassIcon from '~/static/Icons/class.svg?inline'
import HugIcon from '~/static/Icons/hug.svg?inline'

import { mapGetters } from 'vuex'

export default {
  components: {
    ClassIcon,
    HugIcon
  },
  data() {
    return {
      apiStaticUrl: ''
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUserInfo'
    })
  },
  mounted() {
    this.apiStaticUrl = process.env.baseUrl
  }
}
</script>

<style lang="scss" scoped>
.user-profile-wrapper {
  padding: 6px 10px;
}
.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;

  .user-avatar-wrapper {
    // padding: 4px;
    border: 2px solid #434c5e;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    margin-bottom: 1rem;
    overflow: hidden;
  }

  img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  h4 {
    font-size: 20px;
  }
  p {
    font-size: 13px;
    color: rgb(173, 172, 172);
  }
}

.user-meta-wrapper {
  margin-top: 8px;
  background-color: var(--tertiary-background-color);
  color: var(--primary-font-color);
  border-radius: 4px;
  padding: 6px 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.user-meta-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 10px;
  margin-top: 4px;

  h5 {
    font-size: 18px;
    margin-bottom: 0;
  }
  p {
    font-size: 12px;
    margin-top: -4px;
  }
}
</style>
