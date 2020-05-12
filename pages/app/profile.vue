<template>
  <div id="profile">
    <div class="user-profile">
      <div class="user-info">
        <img :src="apiStaticUrl + '/uploads/images/' + user.avatar" alt />
        <h4>{{user.name}}</h4>
      </div>
      <div class="user-meta">
        <div class="user-meta-item" @click="$router.push('/app/profile/classes')">
          <ClassIcon />
          <div class="user-meta-info">
            <h5>4</h5>
            <p>Teaching</p>
          </div>
        </div>
        <div class="user-meta-item" @click="$router.push('/app/profile/classes')">
          <HugIcon />
          <div class="user-meta-info">
            <h5>24</h5>
            <p>Enrolled</p>
          </div>
        </div>
      </div>
      <ul class="user-profile-actions">
        <li>
          <nuxt-link to="/app/profile/info">Profile</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/app/profile/enrolled">Enrolled</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/app/profile/teaching">Teaching</nuxt-link>
        </li>
      </ul>
    </div>
    <div class="user-profile-content">
      <nuxt-child />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ClassIcon from '~/static/Icons/class.svg?inline'
import HugIcon from '~/static/Icons/hug.svg?inline'

export default {
  components: {
    ClassIcon,
    HugIcon
  },
  data() {
    return {
      themeMode: '',
      activeLink: '',
      apiStaticUrl: ''
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  mounted() {
    this.apiStaticUrl = process.env.baseUrl
  }
}
</script>


<style lang="scss" scoped>
@import '../../assets/css/_base';

#profile {
  margin-left: 5rem;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  overflow-x: hidden;

  .user-meta {
    padding: 4px 8px;
    margin-top: 2rem;
    min-width: 100%;
    display: flex;
    justify-content: space-between;

    .user-meta-item {
      background-color: transparent;
      svg {
        width: 30px;
        height: 30px;
        fill: black !important;
        // fill: var(--primary-font-color) !important;
      }
    }
  }
}

.user-profile {
  min-width: 15%;
  a {
    color: var(--primary-font-color);
  }
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    img {
      width: 45px;
      height: 45px;
      border: 2px solid lightslategray;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 8px;
    }
  }
}
.user-profile-content {
  width: 80vw; //setting to, say, 75%, gave weird width issue when then content in /enrolled and /teaching were small
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  margin-left: 4rem;
}
.user-profile-actions {
  margin-top: 2rem;
  li {
    margin-bottom: 8px;
    padding: 8px;
    border-radius: 3px;
    font-size: 14px;
  }
}
</style>