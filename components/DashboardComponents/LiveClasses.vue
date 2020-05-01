<template>
  <div class="upcoming-class-wrapper">
    <h4 class="section-title">Live Classes</h4>
    <div v-if="onlineClasses && onlineClasses.length > 0">
      <div class="upcoming-class" v-for="liveClass in onlineClasses" :key="liveClass.classroomId">
        <img :src="apiStaticUrl + '/uploads/images/' + liveClass.classroomImage" alt="Class Image" />
        <div class="class-info">
          <h5>{{liveClass.classroomName}}</h5>
          <!-- <p>{{liveClass.startTime}}</p> -->
          <p>
            Started at
            {{liveClass.startTime | timeSpanned}}
          </p>
        </div>
        <p class="online-indicator"></p>
      </div>
    </div>
    <div v-else>
      <p style="font-size:12px;">No live classes right now.</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      apiStaticUrl: '',
      classStartTime: ''
      //   onlineClasses: []
    }
  },
  computed: {
    ...mapGetters({
      onlineClasses: 'getOnlineClasses'
    })
  },

  mounted() {
    this.apiStaticUrl = process.env.baseUrl
  },
  filters: {
    timeSpanned: function(startTime) {
      if (!startTime) return ''
      const date = new Date(startTime)
      let hours = date.getHours()
      const minutes = '0' + date.getMinutes()
      let amOrPm = 'am'
      if (hours == 0) {
        hours = 12
      } else if (hours > 12) {
        hours = hours % 12
        amOrPm = 'pm'
      }

      return hours + ':' + minutes.substr(-2) + amOrPm
      //   return startTime.getHours()
      //   return new Date().getTime() - startTime
    }
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
  .class-info {
    display: flex;
    flex-direction: column;
    width: 100%;

    h5 {
      font-weight: 500;
    }

    p {
      font-size: 13px;
      color: rgb(173, 172, 172);
      //   color: var(--tertiary-font-color);
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
.online-indicator {
  width: 10px;
  height: 8px;
  border-radius: 50%;
  background-color: lightgreen;
  margin-right: 8px;
}
</style>