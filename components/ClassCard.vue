<template>
  <div
    v-if="courseclass"
    :style="{
      backgroundImage:
        'url(' + apiUrl + '/uploads/images/' + courseclass.backgroundImage + ')'
    }"
    @click="classroomClicked"
  >
    <!-- <p
      style="position:absolute; top:0; right:0;"
      v-if="courseclass.users.indexOf(this.$store.state.user._id) > 0"
    >
      yes
    </p>-->
    <div class="class-card-overlay"></div>
    <div class="class-card-info-wrapper">
      <div class="class-card-info">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <div class="class-teacher-info-wrapper">
            <img
              :src="`${apiUrl}/uploads/images/${courseclass.createdBy.avatar}`"
              alt="User Avatar"
            />
            <div class="class-teacher-info">
              <h4>{{ courseclass.createdBy.name }}</h4>
              <p>{{ courseclass.name }}</p>
            </div>
          </div>
          <TickIcon
            style="height:14px; width:14px;"
            class="tick-icon"
            v-if="courseclass.users.indexOf(this.$store.state.user._id) > -1"
          />
        </div>
        <div class="class-description">
          <p>{{ courseclass.shortInfo }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TickIcon from '~/static/Icons/tick.svg?inline'

export default {
  props: ['courseclass'],
  components: {
    TickIcon
  },
  data() {
    return {
      apiUrl: this.$store.state.apiUrl
    }
  },
  methods: {
    classroomClicked() {
      this.$emit('classroomClicked', this.courseclass)
    }
  }
}
</script>

<style scoped>
.tick-icon {
  fill: lightgreen !important;
}
</style>
