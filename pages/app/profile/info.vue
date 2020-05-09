<template>
  <div id="user-info">
    <!-- <pre>{{user}}</pre> -->
    <div v-if="!updateMode" class="user-details">
      <img
        @click="openFileDialogue"
        :src="apiStaticUrl + '/uploads/images/' + user.avatar"
        alt="User Image"
      />
      <input style="display:none;" @change="onFileChanged" type="file" id="avatar" name="avatar" />
      <h3>{{user.name}}</h3>
      <p>{{user.email}}</p>
      <p>{{user.contact}}</p>
      <button @click="updateMode=true">Edit</button>
    </div>
    <form v-if="updateMode" class="edit-user-form" @submit.prevent="updateUserDetails">
      <div class="form-input">
        <label for="name">Name</label>
        <input type="text" name="name" id="name" v-model="updatedUser.name" />
      </div>
      <div class="form-input">
        <label for="email">Email</label>
        <input type="text" name="email" id="email" v-model="updatedUser.email" />
      </div>
      <div class="form-input">
        <label for="contact">Contact</label>
        <input type="number" name="contact" id="contact" v-model="updatedUser.contact" />
      </div>
      <div class="form-input">
        <input :disabled="isLoading" type="submit" value="Update" />
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      isLoading: false,
      updateMode: false,
      updatedUser: {
        name: '',
        email: '',
        contact: ''
      },
      user: {},
      apiStaticUrl: '',
      newUserAvatar: null,
      userAvatarInput: null
    }
  },
  methods: {
    openFileDialogue() {
      this.userAvatarInput.click()
    },
    onFileChanged(e) {
      this.newUserAvatar = e.target.files[0]
      this.updateUserAvatar()
    },
    // Todo refactor setting the user value from store
    async updateUserAvatar() {
      if (this.newUserAvatar) {
        let formData = new FormData()
        formData.append('image', this.newUserAvatar)
        // console.log(formData)
        const response = await this.$store.dispatch(
          'updateUserAvatar',
          formData
        )
        if (response.data.error) {
          this.$toast.open({
            type: 'error',
            message: response.data.message,
            position: 'top-right',
            duration: 1500
          })
          return false
        } else {
          this.$store.commit('setUser', { user: response.data.payload.user })
          this.user = this.$store.state.user
          this.updatedUser = { ...this.user }
          this.$forceUpdate()
          this.$toast.open({
            type: 'success',
            message: response.data.message,
            position: 'top-right',
            duration: 1500
          })
        }
      }
    },
    async updateUserDetails() {
      if (
        this.updatedUser.name === '' ||
        this.updatedUser.email === '' ||
        this.updatedUser.contact === ''
      ) {
        return this.$toast.open({
          type: 'error',
          message: "Please don't leave any field empty",
          position: 'top-right',
          duration: 1500
        })
      }
      const response = await this.$store.dispatch(
        'updateUserDetails',
        this.updatedUser
      )
      if (response.data.error) {
        this.$toast.open({
          type: 'error',
          message: response.data.message,
          position: 'top-right',
          duration: 1500
        })
        return false
      } else {
        this.$store.commit('setUser', { user: response.data.payload.user })
        this.user = this.$store.state.user
        this.updatedUser = { ...this.user }
        this.$forceUpdate()
        this.$toast.open({
          type: 'success',
          message: response.data.message,
          position: 'top-right',
          duration: 1500
        })
        this.updateMode = false
      }
    }
  },
  // computed: {
  //   ...mapState({
  //     user: state => state.user
  //   })
  // },
  mounted() {
    this.user = this.$store.state.user
    this.updatedUser = { ...this.user }
    this.apiStaticUrl = process.env.baseUrl
    this.userAvatarInput = document.getElementById('avatar')
  }
}
</script>

<style lang="scss" scoped>
.user-details {
  img {
    width: 240px;
    height: 300px;
    object-fit: cover;
    border-radius: 5px;
    margin-bottom: 8px;
    cursor: pointer;
  }
  h3 {
    margin-bottom: 8px;
  }
  p {
    margin-bottom: 8px;
  }
  button {
    background-color: #434c5e;
    color: white;
  }
}
form {
  width: 60%;
}
.form-input input[type='text'],
.form-input input[type='number'] {
  box-shadow: none;
  background-color: var(--secondary-background-color);
}

.form-input input[type='submit'] {
  width: 20%;
  background-color: #434c5e;
  color: white;
}
</style>