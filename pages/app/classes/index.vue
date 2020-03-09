<template>
  <div id="main-classroom">
    <div class="search-classes">
      <input
        placeholder="Search Classes"
        type="text"
        name="search"
        id="search"
        v-model="searchText"
        onchange="searchClass"
      />
    </div>
    <div class="available-classes">
      <div v-for="availableClass in searchResults" :key="availableClass.id">
        <ClassCard :courseclass="availableClass" />
      </div>
    </div>
    <ClassCard />
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
  }
}
</script>
