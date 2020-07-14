<template>
  <div class="upcoming-class-wrapper">
    <h4 class="section-title">Upcoming Classes</h4>
    <!-- <div class="upcoming-class">
      <img src="~/static/Images/laptop.jpg" alt="Class Image" />
      <div class="class-info">
        <h5>Web Development</h5>
        <div class="class-start-time">
          <p>March 13</p>
          <span>&#8226;</span>
          <p>11:00am-2:30pm</p>
        </div>
      </div>
    </div>-->
    <div class="upcoming-class" v-for="upClass in upcomingClasses" :key="upClass._id">
      <img :src="apiStaticUrl + '/uploads/images/' + upClass.backgroundImage" alt="Class image" />
      <div class="class-info">
        <h5>{{upClass.name}}</h5>
        <div class="class-start-time">
          <!-- <p>{{upClass.startTime}}</p> -->
          <p>
            In {{Math.floor(upClass.upcomingClassTimeInSeconds / 60 / 60)}}h {{Math.floor(upClass.upcomingClassTimeInSeconds / 60 ) - (Math.floor(upClass.upcomingClassTimeInSeconds / 60 / 60)) * 60}}m
            <span>@{{upClass.startTime}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      upcomingClasses: [],
      apiStaticUrl: ''
    }
  },
  methods: {
    async fetchUpcomingClasses() {
      const response = await this.$store.dispatch('fetchUpcomingClasses')
      if (response.data.error) {
        this.$toast.open({
          type: 'error',
          message: response.data.message,
          position: 'top-right',
          duration: 1500
        })
        return false
      } else {
        const { upcomingClasses } = response.data.payload
        this.upcomingClasses = upcomingClasses
        console.log(upcomingClasses)
      }
    }
  },
  mounted() {
    this.fetchUpcomingClasses()
    this.apiStaticUrl = process.env.baseUrl
  }
}
</script>

<style lang="scss" scoped>
.upcoming-class-wrapper {
  margin-top: 3rem;
}
.upcoming-class {
  margin-top: 16px;
  display: flex;
  align-items: center;
  width: 100%;

  &:hover h5 {
    filter: opacity(0.8);
  }

  .class-info {
    display: flex;
    flex-direction: column;
    width: 100%;

    h5 {
      font-weight: 500;
      cursor: pointer;
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