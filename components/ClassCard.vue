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

<style scoped>
.available-classes {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 3rem;
}

.class-card {
  grid-column: span 4;
  background-position: center;
  background-size: cover;
  position: relative;
  min-height: 270px;
  width: 250px;
  border-radius: 7px;
  box-shadow: 0 6px 31px -2px rgba(0, 0, 0, 0.36);
  overflow: hidden;
  cursor: pointer;
}
.class-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0f2027;
  background: -webkit-linear-gradient(to right, #2c5364, #203a43, #0f2027);
  background: linear-gradient(to right, #2c5364, #203a43, #0f2027);
  opacity: 0.65;
}

.class-card-info-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 10;
}
.class-card-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px 12px;
  height: 100%;
  color: white;
}
.class-card-info p {
  font-size: 13px;
}
.class-teacher-info-wrapper {
  display: flex;
}
.class-teacher-info-wrapper img {
  width: 30px;
  height: 30px;
}
.class-teacher-info {
  display: flex;
  flex-direction: column;
  margin-left: 8px;
}
.class-teacher-info h4 {
  font-size: 15px;
  margin-bottom: 0;
  font-weight: 600;
}
.class-teacher-info p {
  font-size: 12px;
  margin-top: -4px;
  font-style: italic;
}
.class-description {
  background-color: #0f2027;
  padding: 4px 8px;
  border-radius: 5px;
}
</style>