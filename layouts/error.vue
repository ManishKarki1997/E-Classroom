<template>
  <div class="container">
    <h2 v-if="error.statusCode === 404"><span>404</span>Page not found</h2>
    <h2 v-else>An error occurred</h2>
    <br />
    <nuxt-link to="/">Home page</nuxt-link>
  </div>
</template>

<script>
export default {
  props: ['error'],
}
</script>
