<template>
  <div class="add-resource-wrapper">
    <form @submit.prevent="emitAddResourceEvent">
      <div class="form-input">
        <label for="resourceName">Name</label>
        <input v-model="newResource.name" type="text" name="resourceName" id="resourceName" />
      </div>
      <div class="form-input">
        <label for="resourceDescription">Description</label>
        <textarea
          v-model="newResource.description"
          name="resourceDescription"
          id="resourceDescription"
          cols="30"
          rows="10"
        ></textarea>
        <!-- <input
          v-model="newResource.description"
          type="text"
          name="resourceDescription"
          id="resourceDescription"
        />-->
      </div>
      <div class="form-input">
        <label for="resourceFile">
          File Upload
          <!-- <UploadIcon style="height:16px;width:16px;" /> -->
        </label>
        <input type="file" name="resourceFile" id="resourceFile" @change="onFileChanged" />
      </div>
      <div>
        <button type="submit">Add</button>
        <button @click="toggleModal">Close</button>
      </div>
    </form>
  </div>
</template>

<script>
import UploadIcon from '~/static/Icons/upload.svg?inline'
export default {
  props: ['classId', 'hideModal'],
  components: {
    UploadIcon
  },
  data() {
    return {
      newResource: {
        name: '',
        description: '',
        createdBy: '',
        classId: '',
        fileType: ''
      },
      resourceFile: null
    }
  },
  methods: {
    toggleModal() {
      this.$emit('hideModal', false)
    },
    async emitAddResourceEvent() {
      // insert classId and createdBy to the new resource object
      this.newResource.classId = this.classId
      this.newResource.createdBy = this.$store.state.user._id

      //   basic valdiation
      if (
        this.newResource.name === '' ||
        this.newResource.description === '' ||
        this.newResource.createdBy === '' ||
        this.newResource.classId === '' ||
        this.resourceFile === null
      ) {
        this.$toast.open({
          type: 'error',
          message: 'Please fill all fields.',
          position: 'top-right',
          duration: 1500
        })
        return false
      }

      let formData = new FormData()
      formData.append('name', this.newResource.name)
      formData.append('description', this.newResource.description)
      formData.append('classId', this.classId)
      formData.append('userId', this.$store.state.user._id)
      formData.append('createdBy', this.newResource.createdBy)
      formData.append('resource', this.resourceFile)

      // emit an event to the parent to add new resource
      this.$emit('addNewResource', formData)
    },
    onFileChanged(e) {
      this.resourceFile = e.target.files[0]
    }
  },
  mounted() {
    // if  the use presses escape key, emit the event to close the modal
    // stackoverflow ftw
    const that = this
    document.onkeydown = function(evt) {
      evt = evt || window.event
      var isEscape = false
      if ('key' in evt) {
        isEscape = evt.key === 'Escape' || evt.key === 'Esc'
      } else {
        isEscape = evt.keyCode === 27
      }
      if (isEscape) {
        that.toggleModal()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '../../assets/css/_base';

.add-resource-wrapper {
  padding: 1rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40vw;
  background-color: var(--tertiary-background-color);
  color: var(--primary-font-color);
  // background-color: $tertiary-background-dark;
  // color: $primary-text-dark;
}
.form-input {
  textarea {
    margin-top: 8px;
    border: none;
  }
}

input[type='text'],
textarea {
  background-color: var(--secondary-background-color);
}

button {
  border-radius: 3px;
  padding: 8px 20px;
  cursor: pointer;
  color: var(--primary-font-color);
}

button:first-child {
  background-color: #191c28;
  border: 1px solid #434c5e;
  color: white;
}
button:last-child {
  background-color: transparent;
  // border: 1px solid #434c5e;
}
</style>