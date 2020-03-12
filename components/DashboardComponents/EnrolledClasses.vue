<template>
  <div id="enrolled-classes-wrapper">
    <h4 class="section-title">Enrolled Classes</h4>
    <ul class="enrolled-classes">
      <li class="enrolled-class">
        <img src="~/static/Images/laptop.jpg" alt="Class Image" />
        <div class="class-info">
          <h5>Web Development</h5>
          <p>Gilgamesh</p>
        </div>
      </li>
      <li class="enrolled-class">
        <img src="~/static/Images/appdevelopment.jpg" alt="Class Image" />
        <div class="class-info">
          <h5>Mobile App Development</h5>
          <p>Ishtar</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
#enrolled-classes-wrapper {
  background-color: #eceff4;
}
.enrolled-classes {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
}
.enrolled-class {
  display: flex;
  margin-bottom: 20px;
  cursor: pointer;

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 12px;
  }

  .class-info {
    h5 {
      font-weight: 500;
    }
    p {
      font-size: 13px;
      margin-top: -4px;
      color: rgb(173, 172, 172);
    }
  }
}
</style>