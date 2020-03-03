<template>
  <div>
    <button @click="shareCameraStream">Share Camera</button>
    <button @click="stopCameraShare">Stop Sharing</button>
    <VideoStream ref="videostream" :cameraStream="cameraStream" />
    <!-- <VideoStream /> -->
  </div>
</template>

<script>
import VideoStream from '~/components/StudyComponents/VideoStream'

export default {
  components: {
    VideoStream
  },
  data() {
    return {
      cameraStream: null,
      cameraConstraints: {
        audio: true,
        video: true
      }
    }
  },
  methods: {
    async shareCameraStream() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const mediaStream = await navigator.mediaDevices.getUserMedia(
            this.cameraConstraints
          )
          this.cameraStream = mediaStream
        }
      } catch (error) {
        console.error(error)
      }
    },
    stopCameraShare() {
      this.$refs.videostream.stopCameraStream()
      this.cameraStream = null
    }
  }
}
</script>