<template>
  <div class="account-confirmation-wrapper">
    <Navbar />

    <div class="content-wrapper">
      <div class="content">
        <h4>Confirm Email</h4>
        <p>
          Please check your mail and click on the link to account your account.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  components: {
    Navbar,
  },
  methods: {
    async verifyAccount(token) {
      const res = await this.$store.dispatch('verifyAccount', token)

      if (res.data.error) {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Please provide both email and password',
          type: 'danger',
          dismissAfter: 3000,
        })
        return
      } else {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: res.data.message,
          type: 'success',
          dismissAfter: 3000,
        })

        setTimeout(() => {
          this.$router.push('/login')
        }, 1000)
      }
    },
  },
  mounted() {
    const { token } = this.$route.query
    this.verifyAccount(token)
  },
}
</script>

<style lang="scss" scoped>
.account-confirmation-wrapper {
  width: 100vw;
  height: 100vh;
  background-color: var(--secondary-background-color);

  .content-wrapper {
    width: 100%;
    height: calc(100vh - 6rem);
    background-color: var(--primary-background-color);
    color: var(--primary-font-color);
    display: flex;
    align-items: center;
    justify-content: center;

    .content {
      padding: 1rem;
      border-radius: 5px;
      text-align: center;
      h4 {
        font-size: 2rem;
        margin-bottom: 4px;
      }
    }
  }
}
</style>
