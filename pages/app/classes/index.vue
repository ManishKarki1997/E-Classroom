<template>
  <div id="main-classroom">
    <div class="classes-overlay" :class="{darken:showCreateClassForm}">
      <div class="search-classes">
        <input
          placeholder="Search Classes"
          type="text"
          name="search"
          id="search"
          v-model="searchText"
          onchange="searchClass"
        />
        <button
          v-if="!showCreateClassForm"
          @click="showCreateClassForm=!showCreateClassForm"
        >Create a Class</button>
      </div>
      <div class="available-classes">
        <div v-for="availableClass in searchResults" :key="availableClass.id">
          <ClassCard :courseclass="availableClass" />
        </div>
      </div>
      <ClassCard />
    </div>
    <div class="create-class-wrapper" v-if="showCreateClassForm">
      <form @click="createClass">
        <div class="form-input">
          <label for="className">Name</label>
          <input type="text" name="className" id="className" />
        </div>
        <div class="form-input">
          <label for="classBackgroundImage">Image</label>
          <input type="file" accept="image/*" name="classBackgroundImage" id="classBackgroundImage" />
        </div>
        <div class="form-input">
          <label for="classroomDescription">Description</label>
          <input type="text" name="classroomDescription" id="classroomDescription" />
        </div>
        <div class="form-input">
          <label for="classSubject">Subject</label>
          <input type="text" name="classSubject" id="classSubject" />
        </div>
        <div>
          <input type="submit" value="Create" />
          <button @click="showCreateClassForm=false">Close</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import ClassCard from '~/components/ClassCard'

export default {
  components: {
    ClassCard
  },
  data() {
    return {
      showCreateClassForm: false,
      searchText: '',
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
  },
  computed: {
    searchResults() {
      return this.classes.filter(courseClass =>
        courseClass.className
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      )
    }
  },
  methods: {
    createClass() {}
  }
}
</script>

<style lang="scss" scoped>
.create-class-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 6px 31px -2px rgba(0, 0, 0, 0.1);
  z-index: 10;
  background-color: white;
  padding: 1rem 2rem;
  border-radius: 3px;
}
input[type='file'] {
  border: none;
}
</style>