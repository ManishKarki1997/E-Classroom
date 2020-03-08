<template>
  <div class="camera-player-wrapper">
    <video id="cameraStreamPlayer" autoplay></video>
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
      this.videoContainer.srcObject = newStream
      // this.videoContainer.onloadedmetadata = function(e) {
      //   this.videoContainer.play()
      // }
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
.camera-player-wrapper {
  width: 100%;
  height: 10rem;
  margin-top: 4px;
}
#cameraStreamPlayer {
  width: 100%;
  height: 100%;
  /* background-image: url('../../static/Images/Saber.jpg'); */
  /* background-position: center; */
  /* background-size: cover; */
}
</style>