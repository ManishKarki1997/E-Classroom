<template>
  <div class="login-container">
    <div class="login-description">
      <h2>Hello</h2>
      <p>Please login to proceed.</p>
      <div style="margin-top:1rem; display:flex;align-items:center;">
        <button style="margin-right:1rem;">Signup</button>
        <p>Forgot Password?</p>
      </div>
    </div>
    <div class="login-form-container">
      <form>
        <div class="form-input">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" />
        </div>
        <div class="form-input">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}
.login-description {
  width: 40%;
  padding: 3rem 6rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.login-form-container {
  clip-path: polygon(23% 0, 100% 0%, 100% 100%, 1% 100%);
  background-color: #191c28;
  color: white;
  height: 100%;
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-form-container form {
  width: 55%;
  padding: 1rem;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.05);
  background-color: rgb(30, 34, 36);
}
.form-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
</style>