<template>
  <div class="add-video-wrapper">
    <form @submit.prevent="emitAddVideoEvent">
      <div class="form-input">
        <label for="videoname">Name</label>
        <input v-model="newVideo.name" type="text" name="videoname" id="videoname" />
      </div>
      <div class="form-input">
        <label for="videoUrl">URL</label>
        <input v-model="newVideo.url" type="text" name="videoUrl" id="videoUrl" />
      </div>
      <div>
        <button type="submit">Add</button>
        <button @click="toggleModal">Close</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newVideo: {
        name: '',
        url: '',
        classId: '',
        createdBy: ''
      }
    }
  },
  methods: {
    toggleModal() {
      this.$emit('hideModal', false)
    },
    async emitAddVideoEvent() {
      this.newVideo.createdBy = this.$store.state.user._id
      this.newVideo.classId = this.$route.params.class

      //   basic valdiation
      if (
        this.newVideo.name === '' ||
        this.newVideo.url === '' ||
        this.newVideo.createdBy === '' ||
        this.newVideo.classId === ''
      ) {
        this.$toast.open({
          type: 'error',
          message: 'Please fill all fields.',
          position: 'top-right',
          duration: 1500
        })
        return false
      }

      // emit an event to the parent to add new resource
      this.$emit('addNewVideo', this.newVideo)
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
.add-video-wrapper {
  padding: 1rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40vw;
  background-color: var(--primary-background-color);
  color: var(--primary-font-color);
  // background-color: $tertiary-background-dark;
  // color: $primary-text-dark;
}
</style>