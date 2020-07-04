<template>
  <div id="class-users-wrapper">
    <h2>All Users</h2>
    <div class="class-users">
      <div v-for="user in classUsers" :key="user._id" class="user">
        <div class="user-basic-info">
          <img :src="apiStaticUrl + '/uploads/images/' + user.avatar" alt />
          <h4 :class="{currentUser:currentUser._id === user._id }">{{ user.name }}</h4>
        </div>
        <div class="user-additional-info">
          <p>{{ user.email }}</p>
          <p>{{ user.contact }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      classUsers: [],
      apiStaticUrl: ''
    }
  },
  methods: {
    async fetchClassUsers() {
      const res = await this.$store.dispatch(
        'fetchClassUsers',
        this.$route.params.class
      )
      this.classUsers = res.data.payload.users
      console.log(res.data)
    }
  },
  computed: mapState({
    currentUser: state => state.user
  }),
  mounted() {
    this.fetchClassUsers()
    this.apiStaticUrl = process.env.baseUrl
  }
}
</script>

<style lang="scss" scoped>
#class-users-wrapper {
  padding: 1rem;
}
.class-users {
  margin-top: 1rem;
  padding: 1rem 0;

  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 1rem;

  .user {
    grid-column: span 3;

    .user-basic-info {
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-bottom: 8px;
      }

      .currentUser {
        color: lightgreen;
      }
    }
  }

  .user-additional-info {
    margin-top: 8px;

    p {
      margin-bottom: 4px;
      font-size: 14px;
    }
  }
}
</style>