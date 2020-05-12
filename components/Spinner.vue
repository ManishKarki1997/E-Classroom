<template>
  <div class="spinner"></div>
</template>

<style lang="scss" scoped>
.spinner {
  border: 4px solid rgb(230, 227, 227);
  border-bottom: 4px solid rgb(57, 56, 56);
  border-radius: 50%;
  width: 25px;
  height: 25px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>