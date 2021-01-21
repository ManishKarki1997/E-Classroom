<template>
  <div class="upcoming-classes">
    <h2>Upcoming Classes</h2>
    <p v-if="upcomingClasses.length == 0" style="margin-top: 4px">
      No Classes Joined Yet
    </p>
    <div
      class="upcoming-class-item"
      v-for="(upcomingClass, index) in upcomingClasses"
      :key="'upcoming-class-' + index + '-' + upcomingClass._id"
    >
      <p>
        <strong>{{ upcomingClass.name }}</strong>
        class is in
        {{ upcomingClass.humanizedTime }} @
        {{ upcomingClass.startTime }}
      </p>

      <vac :end-time="upcomingClass.milliseconds">
        <template v-slot:process="{ timeObj }">
          <span>{{ ` ${timeObj.h}h : ${timeObj.m}m : ${timeObj.s}s` }}</span>
        </template>
        <template v-slot:finish>
          <span>Done!</span>
        </template>
      </vac>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import moment from 'moment'
import { mapState } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  data() {
    return {
      upcomingClasses: [],
    }
  },
  computed: {
    ...mapState(['user', 'apiUrl', 'viewNotificationModal']),
  },
  methods: {
    async fetchUpcomingClasses() {
      const response = await this.$axios.get(`/class/upcoming/all`, {
        headers: {
          Authorization: `Bearer ${this.$store.state.jwtToken}`,
        },
      })

      let allClasses =
        this.user?.userType === 'TEACHER'
          ? response.data.payload.upcomingClasses.createdClasses
          : response.data.payload.upcomingClasses.joinedClasses

      let filteredUpcomingClasses = allClasses.map((joinedClass) => {
        const ms = moment(moment().format('hh:mm'), 'hh:mm').diff(
          moment(joinedClass.startTime, 'hh:mm')
        )
        const humanizedTime = moment.duration(ms).humanize()
        const inMins = humanizedTime.split(' ')[0] * 60
        return {
          ...joinedClass,
          startTime: moment(joinedClass.startTime, 'hh:mm A').format('hh:mm A'),
          endTime: moment(joinedClass.endTime, 'hh:mm A').format('hh:mm A'),
          milliseconds: new Date().getTime() + inMins * 60 * 1000,
          inMins,
          humanizedTime,
        }
      })

      this.upcomingClasses = filteredUpcomingClasses.sort(
        (a, b) => a.inMins - b.inMins
      )

      this.$store.commit('setUpcomingClasses', this.upcomingClasses)
    },
  },
  mounted() {
    // this.fetchUserDetails()
    if (this.user?.userType !== 'ADMIN') {
      this.fetchUpcomingClasses()
    }
  },
  filters: {
    formatDate(value) {
      return dayjs(value).format('MMMM DD')
    },
  },
}
</script>

<style lang="scss" scoped>
.upcoming-classes {
  margin-top: 4rem;
  background-color: var(--primary-background-color);
  border-radius: 5px;
  padding: 2rem;
  // color: var(--opposite-font-color);
  color: var(--primary-font-color);

  @include normalBoxShadow;
  transition: all 0.3s ease-in-out;

  &:hover {
    @include hoverBoxShadow;
  }

  .upcoming-class-item {
    // background-color: var(--primary-background-color);
    padding: 8px 0;
    border-radius: 5px;
    // margin: 8px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
      strong {
        font-style: italic;
      }
      margin: 1rem 0;
      color: var(--primary-font-color);

      // color: var(--opposite-font-color);
    }

    span {
      color: var(--primary-font-color);

      // color: var(--opposite-font-color);
      font-weight: bold;
    }
  }
}
</style>
