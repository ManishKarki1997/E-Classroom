<template>
  <div class="available-classes">
    <div
      v-for="availableClass in classes"
      :key="availableClass.id"
      class="class-card"
      :style="`background-image:url(/Images/${availableClass.classImage})`"
    >
      <div class="class-card-overlay"></div>
      <div class="class-card-info-wrapper">
        <div class="class-card-info">
          <div class="class-teacher-info-wrapper">
            <img :src="`/Images/${availableClass.teacher.avatar}`" alt="User Avatar" />
            <div class="class-teacher-info">
              <h4>{{availableClass.teacher.name}}</h4>
              <p>{{availableClass.className}}</p>
            </div>
          </div>
          <div class="class-description">
            <p>{{availableClass.classDescription}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classes: [
        {
          id: 'class001',
          className: 'Web Development',
          classDescription:
            'Learn about web development with the best practices and hands on real life projects.',
          classImage: 'laptop.jpg',
          teacher: {
            name: 'Arthur Pendragon',
            avatar: 'avatar.png'
          }
        },
        {
          id: 'class002',
          className: 'Mobile App Development',
          classDescription:
            'Get hands on experience in mobile development with Flutter for both Android and IOS.',
          classImage: 'appdevelopment.jpg',
          teacher: {
            name: 'Ishtar',
            avatar: 'femaleavatar.png'
          }
        }
      ]
    }
  }
}
</script>
