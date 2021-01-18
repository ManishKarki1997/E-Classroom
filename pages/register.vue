<template>
  <div id="register">
    <div class="register-left-wrapper">
      <h2>Virtual Classroom</h2>
      <DreamerIcon />
    </div>
    <div class="register-right-wrapper">
      <h3>Create an account</h3>

      <div class="form-wrapper">
        <form @submit.prevent="register">
          <div class="form-input">
            <label for="name">Name</label>
            <input v-model="user.name" type="text" name="name" id="name" />
          </div>
          <div class="form-input">
            <label for="email">Email</label>
            <input v-model="user.email" type="email" name="email" id="email" />
          </div>
          <div class="form-input">
            <label for="password">Password</label>
            <input v-model="user.password" type="password" name="password" id="password" />
          </div>
          <div class="form-input">
            <label for="confirmPassword">Confirm Password</label>
            <input
              v-model="confirmPassword"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
            />
          </div>
          <!-- <div class="form-input">
            <label for="contact">Contact</label>
            <input type="text" name="contact" id="contact">
          </div>-->
          <div class="form-input">
            <label for="avatar">Avatar</label>
            <input @change="onFileChanged" type="file" name="avatar" id="avatar" />
          </div>

          <div class="form-input">
            <label for="userType">User Type</label>
            <select v-model="user.userType">
              <option v-for="userType in userTypes" :key="userType" value="userType">{{userType}}</option>
            </select>
          </div>
          <div class="form-button">
            <button :disabled="isLoading" type="submit">Register</button>
          </div>
        </form>
        <div class="register-form-footer">
          <p>Already have an account?</p>
          <nuxt-link to="/login">Login</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DreamerIcon from '~/static/Images/dreamer.svg?inline'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { mapGetters } from 'vuex'

export default {
  components: {
    DreamerIcon,
  },
  data() {
    return {
      user: {
        userType: '',
        email: '',
        password: '',
        avatarURL: '',
        name: '',
        contact: '',
      },
      userTypes: ['STUDENT', 'TEACHER'],

      image: null,
      confirmPassword: '',
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    onFileChanged(e) {
      this.image = e.target.files[0]
    },
    async register() {
      if (
        this.user.email === '' ||
        this.user.password === '' ||
        this.user.name === ''
      ) {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Please provide email, password & name at the very least.',
          type: 'danger',
          dismissAfter: 3000,
        })
        return false
      } else if (this.user.password !== this.confirmPassword) {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Passwords do not match. Please recheck and try again.',
          type: 'danger',
          dismissAfter: 3000,
        })
        return false
      } else {
        let formData = new FormData()
        formData.append('name', this.user.name)
        formData.append('email', this.user.email)
        formData.append('password', this.user.password)
        formData.append('image', this.image)
        // formData.append('contact', this.user.contact)

        this.$store.dispatch('register', formData)
        // console.log('islogged in ', this.isLoggedIn)
        // if (this.isLoggedIn) {
        this.$store.commit('setRootUrl', process.env.rootUrl)
        // setTimeout(() => {
        // this.$router.push('/login')
        // }, 1500)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#register {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  background-color: var(--secondary-background-color);

  .register-left-wrapper {
    width: 50%;
    padding: 2rem;

    h2 {
      text-align: center;
      margin-bottom: 2rem;
    }
    svg {
      width: 100%;
      height: auto;
    }
  }

  .register-right-wrapper {
    width: 60%;
    background-color: var(--primary-background-color);
    height: 100%;
    padding: 3rem 4rem;
    border-left: 1px solid var(--primary-border-color);
    @include normalBoxShadow;

    &:hover {
      @include hoverBoxShadow;
    }

    .form-wrapper {
      //   padding: 3rem;
      border-radius: 5px;
      width: 100%;
      height: 100%;
      //   box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
      //     rgba(9, 30, 66, 0.31) 0px 0px 1px;

      form {
        width: 60%;

        .form-button {
          width: 100%;
          padding: 8px;
          button {
            color: var(--opposite-font-color);
            background-color: var(--button-background-color);
            width: 100%;
            padding: 10px;
            transition: all 0.3s ease-in-out;
            font-family: 'Poppins';
            font-weight: 500;
            font-size: 16px;
            letter-spacing: 1px;
            border: 1px solid var(--primary-border-color);

            &:hover {
              background-color: var(button-background-hover);
            }
          }
        }
      }

      .register-form-footer {
        display: flex;
        align-items: center;
        padding: 8px;

        // justify-content: center;

        p {
          margin-right: 8px;
        }

        a {
          font-weight: bold;
          font-family: 'Poppins';
        }
      }
    }
  }
}
</style>
