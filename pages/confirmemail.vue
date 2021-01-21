<template>
  <div class="confirm-email">
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
export default {
  components: {
    Navbar,
  },
}
</script>

<style lang="scss" scoped>
.confirm-email {
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
