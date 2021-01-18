<template>
  <div class="dashboard-calendar-wrapper" v-if="filterCalendarEvents.length > 0">
    <calendar-view
      :items="filterCalendarEvents"
      :time-format-options="{ hour: 'numeric', minute: '2-digit' }"
      :enable-drag-drop="true"
      :show-date="showDate"
      :enable-date-selection="true"
      @click-item="onCalendarItemClick"
    >
      <calendar-view-header
        slot="header"
        slot-scope="{ headerProps }"
        :header-props="headerProps"
        @input="setShowDate"
      />
    </calendar-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import Modal from '~/components/Modal'

import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar'
require('vue-simple-calendar/static/css/default.css')
require('vue-simple-calendar/static/css/holidays-us.css')

export default {
  components: {
    CalendarView,
    CalendarViewHeader,
    Modal,
  },
  data() {
    return {
      showDate: new Date(moment().format('YYYY-MM-DD')),
      userClasses: [],
    }
  },
  computed: {
    ...mapState(['user', 'userAssignments', 'upcomingClasses']),
    filterCalendarEvents() {
      const events = []

      this.userAssignments.forEach((assignment) => {
        if (
          moment(assignment.dueDate, 'YYYY-MM-DD').isAfter(
            moment().format('YYYY-MM-DD')
          ) &&
          assignment.yetToBeSubmittedBy.indexOf(this.user._id) > -1
        ) {
          events.push({
            title: ` ${moment(assignment.createdAt, 'YYYY-MM-DD').format(
              'DD MMM'
            )} - ${assignment.title}`,
            startDate: moment(assignment.dueDate, 'YYYY-MM-DD'),
            endDate: moment(assignment.dueDate, 'YYYY-MM-DD'),
            classes: 'assignment-class',
            ...assignment,
          })
        }
      })

      // to be done if/when there is an option to conduct classes in selected days onlt
      // this.userClasses.forEach((joinedClass) => {
      //   events.push({
      //     title: `${joinedClass.name}`,
      //     startDate: moment(joinedClass.startTime, 'YYYY-MM-DD'),
      //     endDate: moment(joinedClass.endTime, 'YYYY-MM-DD'),
      //     classes: 'user-class',
      //     ...joinedClass,
      //   })
      // })

      return events
    },
    unsubmittedAssignments() {},
  },
  methods: {
    setShowDate(d) {
      this.showDate = d
    },
    onCalendarItemClick(item) {
      this.$store.commit('setviewNotificationModal', {
        show: true,
        notification: item.originalItem,
      })
      // this.$router.push(
      //   `/app/class/${item.originalItem.classId._id}/assignments`
      // )
    },
    async fetchUserClassesInDetail() {
      const res = await this.$store.dispatch('fetchUserClassesInDetail')
      this.userClasses = res.data.payload.userClasses
    },
  },
  created() {
    // this.fetchUserClassesInDetail()
  },
}
</script>

<style lang="scss">
.dashboard-calendar-wrapper {
  margin: 2rem 0;

  .quill-editor {
    background-color: var(--primary-background-color);
    color: var(--primary-font-color);

    .ql-toolbar {
      .ql-formats {
        button {
          svg {
            path {
              color: white;
            }
            stroke: var(--primary-font-color);
          }
        }
      }
    }
  }

  .cv-wrapper {
    min-height: 40rem;

    .cv-day,
    .cv-header,
    .cv-header-day {
      border: 1px solid var(--primary-border-color);
    }

    .cv-header-nav {
      button {
        background-color: transparent;
        color: var(--primary-font-color);
        border: none;
      }
    }
  }
  .assignment-class {
    background-color: #84c1ff;
  }
}
</style>
