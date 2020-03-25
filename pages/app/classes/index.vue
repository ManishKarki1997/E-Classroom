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

      <!-- If there are results, show them -->
      <div class="available-classes" v-if="searchResults.length>0">
        <div v-for="availableClass in searchResults" :key="availableClass.id">
          <ClassCard :courseclass="availableClass" />
        </div>
      </div>

      <div v-else>
        <p>No classes available</p>
      </div>
      <!-- <ClassCard /> -->
    </div>
    <div class="create-class-wrapper" v-if="showCreateClassForm">
      <form @submit.prevent="createClass">
        <div class="form-input">
          <label for="className">Name</label>
          <input v-model="newClass.name" type="text" name="className" id="className" />
        </div>
        <div class="form-input">
          <label for="classBackgroundImage">Image</label>
          <input
            @change="onFileChanged"
            type="file"
            accept="image/*"
            name="classBackgroundImage"
            id="classBackgroundImage"
          />
        </div>
        <div class="form-input">
          <label for="classroomDescription">Description</label>
          <input
            v-model="newClass.description"
            type="text"
            name="classroomDescription"
            id="classroomDescription"
          />
        </div>
        <div class="form-input">
          <label for="classSubject">Subject</label>
          <input v-model="newClass.subject" type="text" name="classSubject" id="classSubject" />
        </div>
        <div>
          <input type="submit" value="Create" />
          <button :disabled="formSubmitting" @click="showCreateClassForm=false">Close</button>
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
      newClass: {
        name: '',
        description: '',
        createdBy: '',
        subject: ''
      },
      formSubmitting: false,
      classBackgroundImage: null,
      showCreateClassForm: false,
      searchText: '',
      classes: []
    }
  },
  computed: {
    searchResults() {
      return this.classes.filter(courseClass =>
        courseClass.name.toLowerCase().includes(this.searchText.toLowerCase())
      )
    }
  },
  methods: {
    async createClass() {
      this.formSubmitting = true
      if (
        this.newClass.name === '' ||
        this.newClass.description === '' ||
        this.newClass.subject === ''
      ) {
        this.$toast.open({
          type: 'error',
          message: 'Please provide email, password & name at the very least.',
          position: 'top-right',
          duration: 1500
        })
        return false
      }

      this.newClass.createdBy = this.$store.state.user.email

      let formData = new FormData()
      formData.append('name', this.newClass.name)
      formData.append('subject', this.newClass.subject)
      formData.append('createdBy', this.$store.state.user.email)
      formData.append('description', this.newClass.description)
      formData.append('avatar', this.classBackgroundImage)

      const response = await this.$store.dispatch('createNewClass', formData)
      const { error, payload, message } = response.data
      if (error) {
        this.$toast.open({
          type: 'error',
          message,
          position: 'top-right',
          duration: 1500
        })
      } else {
        this.classes.push(payload.classroom)
      }
      this.formSubmitting = false
      this.showCreateClassForm = false
    },
    onFileChanged(e) {
      this.classBackgroundImage = e.target.files[0]
    },
    async fetchAllClasses() {
      const response = await this.$store.dispatch('fetchAllClasses')
      this.classes = response.data.payload.classes
    }
  },
  created() {
    this.fetchAllClasses()
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
input[type='text'] {
  padding: 10px 8px;
}

input[type='submit'],
button {
  margin-left: 8px;
  border-radius: 2px;
  padding: 10px 8px;
  border: none;
}

input[type='file'] {
  border: none;
}
</style>