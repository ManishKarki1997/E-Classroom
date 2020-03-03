<template>
  <div class="wrapper">
    <div class="background-light">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus error blanditiis repellat deleniti voluptatem dolores optio laborum quas ipsa earum!</p>
    </div>
    <div class="background-dark">
      <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, voluptates?</h2>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightPanelActive: false
    }
  }
}
</script>

<style scoped>
.wrapper {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
}
.background-light {
  width: 40%;
  height: 100vh;
}
.background-dark {
  clip-path: polygon(23% 0, 100% 0%, 100% 100%, 1% 100%);
  background-color: #191c28;
  color: white;
  width: 60%;
  height: 100vh;
}
</style>