<template>
  <div id="videos">
    <div class="add-video-button">
      <button @click="toggleModal(true)">Add</button>
    </div>
    <div class="videos">
      <div class="video" v-for="video in videos" :key="video._id">
        <iframe type="text/html" :src="video.url" frameborder="0" allowfullscreen></iframe>
        <p>{{video.name}}</p>
      </div>
    </div>
    <AddVideoModal v-if="showAddVideoModal" @hideModal="toggleModal" @addNewVideo="addNewVideo" />
  </div>
</template>

<script>
import AddVideoModal from '@/components/DashboardComponents/AddVideoModal'

export default {
  components: {
    AddVideoModal
  },
  data() {
    return {
      showAddVideoModal: false,
      videos: []
    }
  },
  methods: {
    toggleModal(value) {
      this.showAddVideoModal = value
    },
    async addNewVideo(newVideo) {
      const response = await this.$store.dispatch(
        'addNewVideoResource',
        newVideo
      )
      console.log(response.data)
      if (response.data.error) {
        this.$toast.open({
          type: 'error',
          message: response.data.message,
          position: 'top-right',
          duration: 1500
        })
        return false
      } else {
        this.$toast.open({
          type: 'success',
          message: response.data.message,
          position: 'top-right',
          duration: 1500
        })
        this.fetchClassVideos()
        this.$forceUpdate()
      }
    },
    async fetchClassVideos() {
      const response = await this.$store.dispatch(
        'fetchClassVideos',
        this.$route.params.class
      )
      if (response.data.error) {
        this.$toast.open({
          type: 'error',
          message: response.data.error.message,
          position: 'top-right',
          duration: 1500
        })
        return false
      } else {
        this.videos = response.data.payload.videos
      }
    }
  },
  mounted() {
    this.fetchClassVideos()
  }
}
</script>


<style lang="scss" scoped>
.add-video-button {
  margin-bottom: 1rem;
}

.videos {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.video {
  grid-column: span 4;

  p {
    font-size: 14px;
    width: 75%;
  }
}
</style>