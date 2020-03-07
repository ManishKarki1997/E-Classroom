<template>
  <div id="classroom">
    <div class="teacher-screen">
      <!-- <button @click="startScreenSharing">Start Capture</button>
      <button @click="stopScreenSharing">Stop Capture</button>-->
      <div class="classroom-action-buttons-wrapper">
        <div class="camera-actions">
          <p style="margin-right:12px;">Share</p>
          <WebcamIcon @click="handleWebcamSharing" />
          <TelevisionIcon
            @click="handleScreenSharing"
            :style="{classroomIconActive:screenSharing.highlightIcon}"
          />
        </div>
        <div class="floating-window-actions">
          <p style="margin-right:12px;">Tools</p>
          <WhiteboardIcon @click="toggleWhiteboard" />
          <CodeEditorIcon @click="toggleCodeEditor" />
        </div>
      </div>
      <Whiteboard v-if="whiteboardOpen" />
      <p
        style="margin-left:1rem;margin-top:1rem; font-size:14px;"
        v-if="!whiteboardOpen && !screenSharing.share"
      >Start the classroom by broadcasting yourself or your screen by clicking on the Share icons above.</p>
      <video id="teacher-screen-video" autoplay></video>
    </div>
    <div class="classroom-right-side">
      <div class="online-students-wrapper">
        <h4>Online Students</h4>
        <ul class="online-students">
          <li>
            <div class="online-student-info">
              <img src="~/static/Images/Saber.jpg" alt="user picture" />
              <p>Gilgamesh</p>
            </div>
            <div class="communication-request-action-buttons">
              <CheckMarkIcon />
              <CloseIcon />
            </div>
          </li>
        </ul>
      </div>

      <!-- <hsc-window-style-metal class="floating-window whiteboard-wrapper">
        <hsc-window
          title="Whiteboard"
          :closeButton="true"
          :isOpen.sync="whiteboardOpen"
          positionHint="-265 / 100"
          :resizable="true"
          :minWidth="900"
          :minHeight="560"
        >
          <Whiteboard />
        </hsc-window>
      </hsc-window-style-metal>-->

      <hsc-window-style-metal class="floating-window">
        <hsc-window
          title="Code Editor"
          :closeButton="true"
          :isOpen.sync="codeEditorOpen"
          positionHint="-215 / -150"
          :resizable="true"
          :minWidth="550"
          :minHeight="350"
          class="code-editor"
        >
          <div class="code-editor-language-options">
            <h5>Choose a language</h5>
            <select name="code-languages" id="code-languages" v-model="codeEditor.cmOptions.mode">
              <option value="text/javascript">Javascript</option>
              <option value="text/x-python">Python</option>
              <option value="text/x-mysql">SQL</option>
            </select>
          </div>
          <codemirror v-model="codeEditor.code" :options="codeEditor.cmOptions"></codemirror>
        </hsc-window>
      </hsc-window-style-metal>

      <StreamsWrapper ref="webcamStreamsWrapper" class="stream-wrapper" />
    </div>
  </div>
</template>

<script>
import StreamsWrapper from '~/components/StudyComponents/StreamsWrapper'
import Whiteboard from '~/components/StudyComponents/Whiteboard'

import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/sql/sql.js'

// theme css
import 'codemirror/theme/rubyblue.css'

// Icons Import
import TelevisionIcon from '~/static/Icons/television.svg?inline'
import CodeEditorIcon from '~/static/Icons/code.svg?inline'
import WebcamIcon from '~/static/Icons/webcamera.svg?inline'
import WhiteboardIcon from '~/static/Icons/whiteboard.svg?inline'
import CheckMarkIcon from '~/static/Icons/correct.svg?inline'
import CloseIcon from '~/static/Icons/close.svg?inline'

export default {
  components: {
    StreamsWrapper,
    TelevisionIcon,
    CodeEditorIcon,
    WhiteboardIcon,
    WebcamIcon,
    CheckMarkIcon,
    CloseIcon,
    Whiteboard
  },
  data() {
    return {
      codeEditor: {
        code: '',
        cmOptions: {
          tabSize: 4,
          mode: 'text/javascript',
          theme: 'rubyblue',
          lineNumbers: true,
          line: true,
          extraKeys: { Ctrl: 'autocomplete' }
        }
      },
      whiteboardOpen: false,
      codeEditorOpen: false,
      screenSharing: {
        share: false,
        highlightIcon: false
      },
      webcamSharing: {
        share: false,
        highlightIcon: false
      },
      displayMediaOptions: {
        video: {
          cursor: 'always',
          width: 1300,
          height: 710
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
    },
    handleScreenSharing() {
      if (this.screenSharing.share) {
        this.stopScreenSharing()
        this.screenSharing.highlightIcon = false
      } else {
        this.startScreenSharing()
        this.screenSharing.highlightIcon = true
      }
      this.screenSharing.share = !this.screenSharing.share
    },
    handleWebcamSharing() {
      if (this.webcamSharing.share) {
        this.$refs.webcamStreamsWrapper.stopCameraShare()
      } else {
        this.$refs.webcamStreamsWrapper.shareCameraStream()
      }
      this.webcamSharing.share = !this.webcamSharing.share
    },
    toggleWhiteboard() {
      this.whiteboardOpen = !this.whiteboardOpen
    },
    toggleCodeEditor() {
      this.codeEditorOpen = !this.codeEditorOpen
    }
  },
  mounted() {
    this.screenVideoContainer = document.getElementById('teacher-screen-video')
  }
}
</script>

<style scoped>
.code-editor-language-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 1rem;
}
.camera-actions,
.floating-window-actions {
  display: flex;
  align-items: center;
  margin-right: 2rem;
}
.classroom-action-buttons-wrapper {
  display: flex;
  align-items: center;
  padding: 8px 1rem;
  background-color: #222839;
}
.classroom-action-buttons-wrapper svg {
  width: 18px;
  height: 18px;
  cursor: pointer;
  fill: white;
  margin-right: 1rem;
}

.floating-window {
  z-index: 20;
}
.whiteboard {
  background-color: rgb(226, 223, 223);
}
.code-editor {
  background-color: #2a2e3a;
}
#classroom {
  display: flex;
  justify-content: space-between;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  padding: 0;
  margin-left: 4rem;
}
#teacher-screen-video {
  width: 100%;
  height: 100%;

  /* margin-top: 1rem; */
  /* background-color: lightblue; */
  background-color: #191c28;
}
.teacher-screen {
  height: 100vh;
}
/* 
::-webkit-scrollbar {
  background-color: #222839;
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #191c28;
}

::-webkit-scrollbar-thumb {
  background: #222839;
  width: 10px;
} */

.online-students-wrapper {
  height: 45%;
  border-radius: 3px;
  box-shadow: 0 6px 14px -2px rgba(0, 0, 0, 0.16);
  padding: 8px;
}
.online-students-wrapper h4 {
  margin-bottom: 1rem;
  width: 100%;
}
.online-students {
  height: 90%;
  overflow-y: auto;
}
.online-students li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.online-student-info {
  display: flex;
  align-items: center;
}
.communication-request-action-buttons svg {
  cursor: pointer;
  margin-left: 8px;
  width: 16px;
  height: 16px;
}
.communication-request-action-buttons svg:first-child {
  fill: rgb(75, 230, 75);
}
.communication-request-action-buttons svg:last-child {
  fill: rgb(238, 32, 32);
}
.online-students p {
  font-size: 14px;
}
.online-students img {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 8px;
}
.teacher-screen {
  width: 75%;
  height: 100%;
  background-color: #191c28;
  color: white;
  position: relative;
}
.classroom-right-side {
  width: 25%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
}
.classroom-action-buttons-wrapper .classroomIconActive {
  fill: red;
  background-color: green;
  width: 40px;
  height: 40px;
}
</style>