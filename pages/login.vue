<template>
  <div id="login">
    <div class="content-wrapper">
      <h2>Virtual Classroom</h2>
      <div class="login-form-wrapper">
        <form @submit.prevent="login">
          <div class="form-input">
            <label for="email">Email</label>
            <input v-model="user.email" type="email" name="email" id="email" />
          </div>

          <div class="form-input">
            <label for="password">Password</label>
            <input
              v-model="user.password"
              type="password"
              name="password"
              id="password"
            />
          </div>

          <div class="form-button">
            <button
              :disabled="isLoading"
              type="submit"
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <svg
                style="margin-right: 8px"
                class="loading-icon"
                v-if="isLoading"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </form>

        <div class="login-form-footer">
          <div>
            <p>Don't have an account?</p>
            <nuxt-link to="/register">Signup</nuxt-link>
          </div>
          <div>
            <!-- <p>Forgot Password?</p> -->
            <nuxt-link to="/resetpassword">Reset Password</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
      isLoading: false,
    }
  },

  methods: {
    async login() {
      this.isLoading = true
      if (this.user.email === '' || this.user.password === '') {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Please provide both email and password',
          type: 'danger',
          dismissAfter: 3000,
        })
        this.isLoading = false
        return false
      }
      await this.$store.dispatch('login', this.user)
      this.isLoading = false
      this.$store.commit('setRootUrl', process.env.rootUrl)
    },
  },
}
</script>

<style lang="scss" scoped>
#login {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--secondary-background-color);
  .content-wrapper {
    h2 {
      text-align: center;
      margin-bottom: 1rem;
    }
    .login-form-wrapper {
      color: var(--primary-font-color);
      background-color: var(--primary-background-color);
      padding: 3rem;
      border-radius: 5px;
      width: 450px;
      max-width: 800px;
      @include normalBoxShadow;
      transition: all 0.3s ease-in-out;

      &:hover {
        @include hoverBoxShadow;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }

      form {
        .form-input {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          margin: 8px 0;

          label {
            margin-bottom: 8px;
          }

          input[type='text'],
          input[type='email'],
          input[type='password'] {
            padding: 12px 16px;
            border-radius: 5px;
            border: 1px solid var(--primary-border-color);
          }
        }
        .form-button {
          width: 100%;
          padding: 1rem;
          button {
            color: var(--opposite-font-color);
            border: 1px solid var(--primary-border-color);
            background-color: var(--button-background-color);
            width: 100%;
            padding: 10px;
            transition: all 0.3s ease-in-out;
            font-family: 'Poppins';
            font-weight: 500;
            font-size: 16px;
            letter-spacing: 1px;
            cursor: pointer;

            &:hover {
              background-color: var(--button-background-hover);
            }
          }
        }
      }

      .login-form-footer {
        div {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 8px;
          a {
            font-weight: bold;
          }

          p {
            margin-right: 8px;
          }
        }
      }
    }
  }
}
</style>
