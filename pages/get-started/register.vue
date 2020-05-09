<template>
  <form class="form-container" @submit.prevent="register">
    <div class="form-input">
      <label for="name">Name</label>
      <input v-model="user.name" type="text" id="name" name="name" />
    </div>
    <div class="form-input">
      <label for="email">Email</label>
      <input v-model="user.email" type="email" id="email" name="email" />
    </div>
    <div class="form-input">
      <label for="password">Password</label>
      <input v-model="user.password" type="password" id="password" name="password" />
    </div>
    <div class="form-input">
      <label for="confirmPassword">Confirm Password</label>
      <input v-model="confirmPassword" type="password" id="confirmPassword" name="confirmPassword" />
    </div>
    <div class="form-input">
      <label for="contact">Contact</label>
      <input v-model="user.contact" type="text" id="contact" name="contact" />
    </div>
    <div class="form-input">
      <label for="avatar">Avatar</label>
      <input @change="onFileChanged" type="file" id="avatar" name="avatar" />
    </div>

    <div class="form-actions">
      <button :disabled="isLoading" type="submit">Signup</button>
    </div>
  </form>
</template>

<style scoped>
input {
  font-size: 14px;
}
</style>

<script>
export default {
  data() {
    return {
      user: {
        email: '',
        password: '',
        avatarURL: '',
        name: '',
        contact: ''
      },
      image: null,
      confirmPassword: '',
      isLoading: false
    }
  },
  methods: {
    onFileChanged(e) {
      this.image = e.target.files[0]
    },
    async register() {
      this.isLoading = true
      if (
        this.user.email === '' ||
        this.user.password === '' ||
        this.user.name === ''
      ) {
        this.$toast.open({
          type: 'error',
          message: 'Please provide email, password & name at the very least.',
          position: 'top-right',
          duration: 1500
        })
        return false
      } else if (this.user.password !== this.confirmPassword) {
        this.$toast.open({
          type: 'error',
          message: 'Passwords do not match. Please recheck and try again.',
          position: 'top-right',
          duration: 1500
        })
        return false
      } else {
        // Create a formData object to append the image file as well
        let formData = new FormData()
        formData.append('name', this.user.name)
        formData.append('email', this.user.email)
        formData.append('password', this.user.password)
        formData.append('image', this.image)
        formData.append('contact', this.user.contact)

        // dispatch an action to register, passsing formData as the payload
        const response = await this.$store.dispatch('register', formData)

        // If there is an error, display a toast notification
        if (response.data.error) {
          this.$toast.open({
            type: 'error',
            message: response.data.message,
            position: 'top-right',
            duration: 1500
          })
        } else {
          // destructure user and jwtToken from the payload if the signup is successful
          const { user, jwtToken } = response.data.payload

          // fire a commit to the store to store the user in localstorage
          this.$store.commit('setUser', { user, jwtToken })
          // display a success toast and redirect to the 'app' route afterwards
          this.$toast.open({
            type: 'success',
            message: 'Successfully Registered. Redirecting...',
            position: 'top-right',
            duration: 1500
          })

          setTimeout(() => {
            this.$router.push('/app')
          }, 1600)
        }
      }
      this.isLoading = false
    }
  }
}
</script>