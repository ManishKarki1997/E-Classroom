<template>
  <div id="classroom">
    <div class="teacher-screen">
      <!-- <button @click="startScreenSharing">Start Capture</button>
      <button @click="stopScreenSharing">Stop Capture</button>-->
      <div class="classroom-action-buttons-wrapper">
        <div class="camera-actions">
          <p style="margin-right:12px;">Share</p>
          <WebcamIcon
            @click="handleWebcamSharing"
            :class="{currentlyActive:webcamSharing.highlightIcon}"
          />
          <TelevisionIcon
            @click="handleScreenSharing"
            :style="{classroomIconActive:screenSharing.highlightIcon}"
            :class="{currentlyActive:screenSharing.highlightIcon}"
          />
        </div>
        <div class="floating-window-actions">
          <p style="margin-right:12px;">Tools</p>
          <WhiteboardIcon :class="{currentlyActive:whiteboardOpen}" @click="toggleWhiteboard" />
          <CodeEditorIcon :class="{currentlyActive:codeEditorOpen}" @click="toggleCodeEditor" />
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
          class="code-editor-wrapper"
        >
          <CodeEditor class="code-editor" />
          <!-- <div class="code-editor-language-options">
            <h5>Choose a language</h5>
            <select name="code-languages" id="code-languages" v-model="codeEditor.cmOptions.mode">
              <option value="text/javascript">Javascript</option>
              <option value="text/x-python">Python</option>
              <option value="text/x-mysql">SQL</option>
            </select>
          </div>
          <codemirror v-model="codeEditor.code" :options="codeEditor.cmOptions"></codemirror>-->
        </hsc-window>
      </hsc-window-style-metal>

      <StreamsWrapper ref="webcamStreamsWrapper" class="stream-wrapper" />
    </div>
  </div>
</template>

<script>
import StreamsWrapper from '~/components/StudyComponents/StreamsWrapper'
import Whiteboard from '~/components/StudyComponents/Whiteboard'
import CodeEditor from '~/components/StudyComponents/CodeEditor'

// import 'codemirror/mode/javascript/javascript.js'
// import 'codemirror/mode/python/python.js'
// import 'codemirror/mode/sql/sql.js'

// // theme css
// import 'codemirror/theme/rubyblue.css'

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
    Whiteboard,
    CodeEditor
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
          width: 1800,
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
        this.webcamSharing.highlightIcon = false
      } else {
        this.$refs.webcamStreamsWrapper.shareCameraStream()
        this.webcamSharing.highlightIcon = true
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

<style lang="scss" scoped>
.currentlyActive {
  fill: rgb(226, 46, 46);
}
</style>