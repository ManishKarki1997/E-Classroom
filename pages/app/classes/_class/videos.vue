<template>
  <div id="videos">
    <div
      class="add-video-button"
      v-if="currentlyViewingClass.createdBy._id === this.$store.state.user._id"
    >
      <button @click="toggleModal(true)">Add</button>
    </div>
    <div class="videos">
      <div class="video" v-for="video in videos" :key="video._id">
        <iframe
          type="text/html"
          :src="'https://youtube.com/embed/' + video.url.split('?v=')[1]"
          frameborder="0"
          allowfullscreen
        ></iframe>
        <div class="video-footer">
          <p>{{ video.name }}</p>
          <EditIcon @click="setUpdateVideo(video)" />
          <DeleteIcon @click="deleteVideo(video._id)" />
        </div>
        <div class="video-edit-wrapper" v-if="updateVideoId === video._id">
          <input type="text" v-model="updateVideoDetail.name" />
          <input type="text" v-model="updateVideoDetail.url" />
          <div class="video-buttons">
            <button @click="updateVideo">Update</button>
            <button @click="cancelEditMode">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <AddVideoModal
      v-if="showAddVideoModal"
      @hideModal="toggleModal"
      @addNewVideo="addNewVideo"
    />
  </div>
</template>

<script>
import AddVideoModal from '@/components/DashboardComponents/AddVideoModal'
import VerticalMenuIcon from '@/static/Icons/vertical_menu.svg?inline'
import DeleteIcon from '@/static/Icons/trash.svg?inline'
import EditIcon from '@/static/Icons/edit.svg?inline'

import { mapGetters } from 'vuex'

export default {
  components: {
    AddVideoModal,
    VerticalMenuIcon,
    EditIcon,
    DeleteIcon
  },
  data() {
    return {
      showAddVideoModal: false,
      videos: [],
      updateVideoId: '',
      updateVideoDetail: {
        name: '',
        url: '',
        videoId: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      currentlyViewingClass: 'getCurrentlyViewingClass',
      currentUser: 'getUserInfo'
    })
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
        this.toggleModal(false)
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
    },
    async deleteVideo(videoId) {
      const response = await this.$store.dispatch('deleteVideo', videoId)
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
    setUpdateVideo(video) {
      this.updateVideoId = video._id
      this.updateVideoDetail.name = video.name
      this.updateVideoDetail.url = video.url
      this.updateVideoDetail.videoId = video._id
    },
    cancelEditMode() {
      this.updateVideoId = ''
      this.updateVideoDetail.name = ''
      this.updateVideoDetail.url = ''
      this.updateVideoDetail.videoId = ''
    },
    async updateVideo() {
      const response = await this.$store.dispatch(
        'updateVideoDetail',
        this.updateVideoDetail
      )
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
        this.cancelEditMode()
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
}
.video-footer {
  display: flex;
  justify-self: space-between;

  p {
    font-size: 14px;
    width: 65%;
  }

  svg {
    width: 14px;
    height: 14px;
    margin-top: 8px;
    cursor: pointer;
    display: none;
    fill: var(--primary-font-color);

    &:last-child {
      margin-left: 8px;
      fill: lightcoral !important;
    }
  }
}
.video {
  &:hover .video-footer svg {
    display: block;
  }
}
.video-edit-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1rem;

  input {
    margin-bottom: 8px;
    width: 75%;
  }

  .video-buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
      &:last-child {
        background-color: transparent;
        color: var(--primary-font-color) !important;
      }
    }
  }
}
</style>
