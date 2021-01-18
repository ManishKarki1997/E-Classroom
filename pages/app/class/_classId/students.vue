<template>
  <div id="class-students-page">
    <div class="class-top-header">
      <h3>Students</h3>
    </div>
    <div v-if="currentClassStudents.length>0" class="class-students">
      <UserCard
        v-for="student in currentClassStudents"
        :key="student._id"
        :userInfo="student"
        :actions="['kickout']"
        @kickoutStudent="kickoutStudent"
      />
    </div>
    <div class="not-available" v-else>
      <p>No students enrolled yet</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from '~/components/UserCard'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['user', 'currentlyViewingClass', 'currentClassStudents']),
  },
  methods: {
    fetchClassStudents() {
      this.$store.dispatch('fetchClassStudents', this.currentlyViewingClass._id)
    },
    kickoutStudent(student) {
      this.$store.dispatch('kickoutStudent', {
        userId: this.user._id,
        classId: this.currentlyViewingClass._id,
        studentId: student._id,
      })
    },
  },
  mounted() {
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
}
</style>