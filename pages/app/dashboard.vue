<template>
  <div id="dashboard-page" v-if="user">
    <div class="dashboard--left">
      <div class="dashboard-user-welcome-wrapper">
        <p>Welcome,</p>
        <h2>{{ user.name }}.</h2>
      </div>

      <QuickLinks style="margin-top: 6rem" />

      <UpcomingClasses />

      <UnsubmittedAssignment v-if="isStudent" />

      <Calendar />

      <!-- <BookmarkedResources /> -->
    </div>
    <div class="dashboard--right">
      <DashboardTabs />
    </div>

    <Modal
      v-if="viewNotificationModal.show"
      @closeModal="closeViewNotification"
    >
      <template slot="header" class="modal-header">
        <h4>{{ viewNotificationModal.notification.type || 'Notification' }}</h4>
        <!-- <h4>{{ viewNotificationModal.notification.modalTitle }}</h4> -->
      </template>

      <template slot="body">
        <div v-if="viewNotificationModal.notification.type === 'KICKOUT'">
          <h4 v-html="viewNotificationModal.notification.title"></h4>
          <p style="margin: 8px 0">
            <span style="font-weight: bold">Reason: </span
            >{{ viewNotificationModal.notification.extraInfo.kickoutReason }}
          </p>
        </div>

        <div v-if="viewNotificationModal.notification.type === 'Notification'">
          <h4
            v-if="viewNotificationModal.notification.title"
            v-html="viewNotificationModal.notification.title"
          ></h4>
          <div
            v-else
            v-html="viewNotificationModal.notification.description"
          ></div>
        </div>

        <div v-if="viewNotificationModal.notification.type === 'Assignment'">
          <h4
            v-if="viewNotificationModal.notification.description"
            v-html="viewNotificationModal.notification.description"
          ></h4>
          <h4 v-else v-html="viewNotificationModal.notification.title"></h4>
        </div>

        <div v-if="viewNotificationModal.notification.type === 'Announcement'">
          <h4>{{ viewNotificationModal.notification.title }}</h4>
          <p>
            {{ viewNotificationModal.notification.description }}
          </p>
        </div>

        <p style="margin-top: 8px">
          <span style="font-weight: bold">Date: </span>

          {{ viewNotificationModal.notification.createdAt | formatDate }}
        </p>

        <div
          v-if="viewNotificationModal.notification.classId !== undefined"
          style="margin-top: 2rem; display: flex; align-items: center"
        >
          <img
            style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 8px;
            "
            :src="
              apiUrl +
              '/uploads/images/' +
              viewNotificationModal.notification.classId.backgroundImage
            "
            alt="Class Image"
          />
          <div>
            <h4>{{ viewNotificationModal.notification.classId.name }}</h4>
            <p class="subtitle">
              {{ viewNotificationModal.notification.classId.users.length }}
              students
            </p>
          </div>
        </div>
      </template>

      <template slot="footer">
        <button @click="closeViewNotification">Close</button>
      </template>
    </Modal>
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar'
import DashboardContents from '~/components/Sidebar'
import BookmarkedResources from '~/components/DashboardComponents/BookmarkedResources'
import QuickLinks from '~/components/DashboardComponents/QuickLinks'
import DashboardTabs from '~/components/DashboardComponents/Tabs/DashboardTabs'
import Calendar from '~/components/DashboardComponents/Calendar'
import UnsubmittedAssignment from '~/components/DashboardComponents/UnsubmittedAssignment'
import UpcomingClasses from '~/components/DashboardComponents/UpcomingClasses'
import Modal from '~/components/Modal'
import { mapState } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import moment from 'moment'
import dayjs from 'dayjs'

export default {
  components: {
    Sidebar,
    BookmarkedResources,
    QuickLinks,
    DashboardTabs,
    Modal,
    UnsubmittedAssignment,
    Calendar,
  },
  computed: {
    ...mapState(['user', 'apiUrl', 'viewNotificationModal']),
    isStudent() {
      return this.user?.userType === 'STUDENT'
    },
  },
  data() {
    return {
      upcomingClasses: [],
    }
  },
  methods: {
    closeViewNotification() {
      this.$store.commit('setviewNotificationModal', {
        show: false,
        notification: null,
      })
    },

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
    // if (this.user?.userType !== 'ADMIN') {
    //   this.fetchUpcomingClasses()
    // }
  },
  filters: {
    formatDate(value) {
      return dayjs(value).format('MMMM DD')
    },
  },
  // validate({ params, query, store }) {
  //   if (store.state.user.userType === 'ADMIN') {
  //     this.$router.push('/app/admin/dashboard')
  //     return true
  //   }
  //   return true
  // },
  beforeRouteLeave(to, from, next) {
    if (this.user && this.user.isKickedOut) {
      this.$store.dispatch(ADD_TOAST_MESSAGE, {
        text:
          "You've been kicked out from the app. Contact the admin to allow access.",
        type: 'danger',
        dismissAfter: 10000,
      })
      return
    }
    next()
  },
}
</script>

<style lang="scss" scoped>
#dashboard-page {
  display: flex;
  justify-content: space-between;
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  background-color: var(--secondary-background-color);

  .dashboard--left {
    width: 72%;
    .dashboard-user-welcome-wrapper {
      border-radius: 5px;
    }
  }
  .dashboard--right {
    width: 25%;
    min-height: 100%;
    padding: 1rem;
  }
}
</style>
