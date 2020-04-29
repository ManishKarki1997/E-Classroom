<template>
  <div class="user-profile-wrapper">
    <div class="user-profile">
      <div class="user-avatar-wrapper">
        <img src="~/static/Images/Saber.jpg" alt="User Picture" />
      </div>
      <h4>Arturia Pendragon</h4>
      <p>Student</p>
    </div>
    <div class="user-meta">
      <div class="user-meta-item">
        <ClassIcon />
        <div class="user-meta-info">
          <h5>4</h5>
          <p>Teaching</p>
        </div>
      </div>
      <div class="user-meta-item">
        <HugIcon />
        <div class="user-meta-info">
          <h5>24</h5>
          <p>Enrolled</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClassIcon from '~/static/Icons/class.svg?inline'
import HugIcon from '~/static/Icons/hug.svg?inline'

export default {
  components: {
    ClassIcon,
    HugIcon
  }
}
</script>

<style  lang="scss" scoped>
.user-profile-wrapper {
  padding: 6px 10px;
}
.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;

  .user-avatar-wrapper {
    // padding: 4px;
    border: 2px solid #434c5e;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    margin-bottom: 1rem;
    overflow: hidden;
  }

  img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  h4 {
    font-size: 14px;
  }
  p {
    font-size: 13px;
    color: rgb(173, 172, 172);
  }
}

.user-meta {
  margin-top: 8px;
  background-color: var(--tertiary-background-color);
  // background-color: #434c5e;
  color: var(--primary-font-color);
  box-shadow: 1px 1px 2px #434c5e;
  border-radius: 4px;
  padding: 6px 20px;
  //   width: 80%;
  //   margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.user-meta svg {
  width: 30px;
  height: 30px;
  fill: rgrgb(143, 141, 141);
}
.user-meta,
.user-meta-item,
.user-meta-info {
  display: flex;
  align-items: center;
}
.user-meta-item svg {
  background-color: white;
  border-radius: 50%;
  padding: 2px 4px;
}
.user-meta-info {
  flex-direction: column;
  align-items: flex-start;
  margin-left: 10px;
  margin-top: 4px;

  h5 {
    font-size: 15px;
    margin-bottom: 0;
  }
  p {
    font-size: 12px;
    margin-top: -4px;
  }
}
</style>