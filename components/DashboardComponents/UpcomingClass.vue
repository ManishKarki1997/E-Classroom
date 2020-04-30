<template>
  <div class="upcoming-class-wrapper">
    <h4 class="section-title">Upcoming Classes</h4>
    <div class="upcoming-class">
      <img src="~/static/Images/laptop.jpg" alt="Class Image" />
      <div class="class-info">
        <h5>Web Development</h5>
        <div class="class-start-time">
          <p>March 13</p>
          <span>&#8226;</span>
          <p>11:00am-2:30pm</p>
        </div>
      </div>
    </div>
    <div class="upcoming-class">
      <img src="~/static/Images/appdevelopment.jpg" alt="Class Image" />
      <div class="class-info">
        <h5>Mobile App Development</h5>
        <div class="class-start-time">
          <p>March 13</p>
          <span>&#8226;</span>
          <p>3:30am-5:30pm</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.upcoming-class-wrapper {
  margin-top: 3rem;
}
.upcoming-class {
  margin-top: 16px;
  display: flex;
  align-items: center;
  width: 100%;
  .class-info {
    display: flex;
    flex-direction: column;
    width: 100%;

    h5 {
      font-weight: 500;
    }

    p {
      font-size: 13px;
    }
    .class-start-time {
      display: flex;
      align-items: center;
      color: rgb(173, 172, 172);

      p {
        &:first-child {
          margin-right: 6px;
        }
      }
      span {
        margin-right: 6px;
        font-size: 18px;
      }
    }
  }
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 8px;
  }
}
</style>