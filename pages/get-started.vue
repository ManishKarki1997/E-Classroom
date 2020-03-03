<template>
  <div class="get-started-wrapper">
    <div class="get-started-form-wrapper">
      <div class="get-started-left">
        <router-link to="/" style="color:white;">
          <h2>E-Class</h2>
        </router-link>
        <div class="get-started-intro">
          <h3>E-Class</h3>
          <p>A new way of learning</p>
          <div class="get-started-nav">
            <router-link to="/get-started/login">Login</router-link>
            <router-link to="/get-started/register">Register</router-link>
          </div>
        </div>
      </div>
      <div class="get-started-right">
        <nuxt-child />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goto(page) {
      this.$router.push(page)
    }
  }
}
</script>

