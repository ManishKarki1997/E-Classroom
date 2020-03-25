<template>
  <div
    class="class-card"
    v-if="courseclass"
    :style="`background-image:url(${apiUrl}/uploads/users/${courseclass.backgroundImage})`"
  >
    <div class="class-card-overlay"></div>
    <div class="class-card-info-wrapper">
      <div class="class-card-info">
        <div class="class-teacher-info-wrapper">
          <img :src="`${apiUrl}/uploads/users/${courseclass.backgroundImage}`" alt="User Avatar" />
          <!-- <img :src="`/Images/${courseclass.teacher.avatar}`" alt="User Avatar" /> -->
          <div class="class-teacher-info">
            <h4>{{courseclass.createdBy}}</h4>
            <p>{{courseclass.name}}</p>
            <!-- <p>{{courseclass.subject}}</p> -->
            <!-- <h4>{{courseclass.teacher.name}}</h4> -->
            <!-- <p>{{courseclass.className}}</p> -->
          </div>
        </div>
        <div class="class-description">
          <p>{{courseclass.description}}</p>
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
  }
}
</script>
