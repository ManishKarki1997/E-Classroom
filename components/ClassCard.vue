<template>
  <div
    v-if="courseclass"
    :style="{backgroundImage:'url(' + apiUrl + '/uploads/images/' +courseclass.backgroundImage + ')'}"
    @click="classroomClicked"
  >
    <div class="class-card-overlay"></div>
    <div class="class-card-info-wrapper">
      <div class="class-card-info">
        <div class="class-teacher-info-wrapper">
          <img :src="`${apiUrl}/uploads/images/${courseclass.createdBy.avatar}`" alt="User Avatar" />
          <div class="class-teacher-info">
            <h4>{{courseclass.createdBy.name}}</h4>
            <p>{{courseclass.name}}</p>
          </div>
        </div>
        <div class="class-description">
          <p>{{courseclass.shortInfo}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['courseclass'],
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
