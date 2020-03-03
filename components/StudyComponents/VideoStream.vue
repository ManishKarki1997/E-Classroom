<template>
  <div>
    <p>this is a video stream</p>
    <div>
      <video id="cameraStreamPlayer" autoplay></video>
    </div>
  </div>
</template>

<script>
export default {
  props: ['cameraStream'],
  data() {
    return {
      videoContainer: null
    }
  },
  mounted() {
    this.videoContainer = document.getElementById('cameraStreamPlayer')
  },
  watch: {
    cameraStream(newStream, oldStream) {
      console.log(newStream)
      this.videoContainer.srcObject = newStream
      this.videoContainer.onloadedmetadata = function(e) {
        this.videoContainer.play()
      }
    }
  },
  methods: {
    stopCameraStream() {
      let tracks = this.videoContainer.srcObject.getTracks()
      tracks.forEach(track => track.stop())
    }
  }
}
</script>

<style scoped>
#cameraStreamPlayer {
  width: 100%;
  height: 10rem;
  background-color: black;
}
</style>