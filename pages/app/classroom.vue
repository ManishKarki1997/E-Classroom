<template>
  <div id="classroom">
    <div class="teacher-screen">
      <p>component one</p>
      <p>This is the teacher's screen view.</p>
      <button @click="startScreenSharing">Start Capture</button>
      <button @click="stopScreenSharing">Stop Capture</button>
      <video id="teacher-screen" autoplay></video>
    </div>
    <!-- <div class="board-and-editor">
      <p>component 2</p>
      <p>This contains whiteboard and text editor</p>
    </div>-->
    <StreamsWrapper class="stream-wrapper" />
  </div>
</template>

<script>
import StreamsWrapper from '~/components/StudyComponents/StreamsWrapper'

export default {
  components: {
    StreamsWrapper
  },
  data() {
    return {
      displayMediaOptions: {
        video: {
          cursor: 'always'
        },
        audio: 'false'
      },
      screenVideoContainer: null
    }
  },
  methods: {
    async startScreenSharing() {
      try {
        this.screenVideoContainer.srcObject = await navigator.mediaDevices.getDisplayMedia(
          this.displayMediaOptions
        )
      } catch (error) {
        console.error(error)
      }
    },
    stopScreenSharing() {
      let tracks = this.screenVideoContainer.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      this.screenVideoContainer.srcObject = null
    }
  },
  mounted() {
    this.screenVideoContainer = document.getElementById('teacher-screen')
  }
}
</script>

<style scoped>
#classroom {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  padding: 0;
  margin-left: 4rem;
}
#teacher-screen {
  width: 100%;
  height: 80%;
  margin-top: 1rem;
}
.teacher-screen,
.board-and-editor,
.stream-wrapper {
  height: 100vh;
}
.teacher-screen {
  width: 70%;
  background-color: #191c28;
  color: white;
}
.board-and-editor {
  width: 40%;
  color: white;
}
.stream-wrapper {
  height: 100vh;
  width: 30%;
}
</style>