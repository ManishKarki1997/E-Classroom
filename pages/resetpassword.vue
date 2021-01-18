<template>
  <div id="login">
    <div class="content-wrapper">
      <h2>Virtual Classroom</h2>
      <div class="login-form-wrapper">
        <form @submit.prevent="resetPassword">
          <div class="form-input">
            <label for="email">Email</label>
            <input v-model="user.email" type="email" name="email" id="email" />
          </div>

          <div class="form-button">
            <button type="submit">Reset Password</button>
          </div>
        </form>

        <div class="login-form-footer">
          <div>
            <p>Already have an account?</p>
            <nuxt-link to="/register">Signup</nuxt-link>
          </div>
          <div>
            <p>Login instead?</p>
            <nuxt-link to="/login">Login</nuxt-link>
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
      },
    }
  },

  methods: {
    resetPassword() {
      this.$store.dispatch('requestPasswordReset', {
        email: this.user.email,
      })
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
