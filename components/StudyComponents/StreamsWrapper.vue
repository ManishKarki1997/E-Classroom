<template>
  <div>
    <VideoStream class="cameraStream" ref="videostream" :cameraStream="cameraStream" />
    <!-- <VideoStream class="cameraStream" /> -->
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
      studentSharedCameraStream: false,
      cameraStream: null,
      cameraConstraints: {
        audio: false,
        video: { width: 1300, height: 720 }
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
          this.teacherShowedCameraStream = true
          this.cameraStream = mediaStream
        }
      } catch (error) {
        console.error(error)
      }
    },
    stopCameraShare() {
      this.$refs.videostream.stopCameraStream()
      this.cameraStream = null
      this.teacherShowedCameraStream = false
    }
  }
}
</script>

