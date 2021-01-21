<template>
  <div id="class-students-page">
    <div class="class-top-header">
      <h3>Students</h3>
    </div>
    <div v-if="currentClassStudents.length > 0" class="class-students">
      <UserCard
        v-for="student in currentClassStudents"
        :key="student._id"
        :userInfo="student"
        :actions="['kickout']"
        @kickoutStudent="confirmKickout(student)"
      />
    </div>
    <div class="not-available" v-else>
      <p>No students enrolled yet</p>
    </div>

    <Modal
      v-if="showKickoutStudentConfirmationModal"
      @closeModal="showKickoutStudentConfirmationModal = false"
    >
      <template slot="header">Kickout Reason</template>
      <template slot="body">
        <form @submit.prevent="kickoutStudent">
          <div class="form-input">
            <label for="reason">Reason</label>
            <textarea
              rows="6"
              name="reason"
              class="kickout-reason-area"
              v-model="reason"
            />
          </div>
        </form>
      </template>

      <template slot="footer">
        <button type="submit" @click="kickoutStudent">Kickout</button>
        <button @click="showKickoutStudentConfirmationModal = false">
          Cancel
        </button>
      </template>
    </Modal>

    <v-dialog />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from '~/components/UserCard'

export default {
  computed: {
    ...mapGetters(['user', 'currentlyViewingClass', 'currentClassStudents']),
  },
  data() {
    return {
      classId: '',
      showKickoutStudentConfirmationModal: false,
      reason: '',
      student: null,
    }
  },
  methods: {
    fetchClassStudents() {
      this.$store.dispatch('fetchClassStudents', this.classId)
    },
    async confirmKickout(student) {
      this.$modal.show('dialog', {
        title: `Kickout`,
        text: `Are you sure you want to kick out ${student.name}?`,
        buttons: [
          {
            title: 'No',
            handler: () => {
              this.$modal.hide('dialog')
              this.showKickoutStudentConfirmationModal = false
            },
          },

          {
            title: 'Yes',
            handler: () => {
              this.student = student
              // this.kickoutStudent()
              this.askForKickoutReason()
              this.$modal.hide('dialog')
            },
          },
        ],
      })
    },
    askForKickoutReason() {
      this.showKickoutStudentConfirmationModal = true
    },
    kickoutStudent() {
      this.$store.dispatch('kickoutStudent', {
        userId: this.user._id,
        classId: this.classId,
        studentId: this.student._id,
        kickoutReason: this.reason,
      })
      this.showKickoutStudentConfirmationModal = false
      this.student = null
    },
  },
  mounted() {
    this.classId = this.$route.params.classId
    this.fetchClassStudents()
  },
}
</script>

<style lang="scss" scoped>
#class-students-page {
  .class-students {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 2rem;
    margin-top: 1rem;
  }

  .kickout-reason-area {
    background-color: var(--primary-background-color);
    color: var(--primary-font-color);
    padding: 8px;
    font-size: 1.1rem;
  }
}
</style>
