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
          <ChatIcon
            style="width:22px;height:22px;"
            :class="{currentlyActive:chatboxOpen,openChat:chatboxOpen}"
            @click="chatboxOpen=!chatboxOpen"
          />
        </div>
      </div>
      <Whiteboard v-if="whiteboardOpen" />
      <p
        style="margin-left:1rem;margin-top:1rem; font-size:14px;"
        v-if="!whiteboardOpen && !screenSharing.share"
      >Start the classroom by broadcasting yourself or your screen by clicking on the Share icons above.</p>
      <video id="teacher-screen-video" autoplay></video>
    </div>

    <hsc-window-style-metal class="floating-window">
      <hsc-window
        title="Code Editor"
        :closeButton="true"
        :isOpen.sync="codeEditorOpen"
        positionHint="-255 / -150"
        :resizable="true"
        :minWidth="550"
        :minHeight="350"
        class="code-editor-wrapper"
      >
        <CodeEditor class="code-editor" />
      </hsc-window>
    </hsc-window-style-metal>

    <div class="classroom-right-side">
      <Chat v-if="chatboxOpen" />
      <div class="online-students-wrapper">
        <h4>Online Students</h4>
        <ul class="online-students">
          <li v-for="onlineUser in onlineUsers" :key="onlineUser.email">
            <div class="online-student-info">
              <img :src="apiStaticUrl + '/uploads/images/' + onlineUser.avatar" />
              <!-- <img src="~/static/Images/Saber.jpg" alt="user picture" /> -->
              <p>{{onlineUser.name}}</p>
            </div>
            <div class="communication-request-action-buttons">
              <CheckMarkIcon />
              <CloseIcon />
            </div>
          </li>
        </ul>
      </div>

      <!-- <div class="video-wrapper"></div> -->
      <video
        style="width:100%; height:250px; background-color:lightblue;"
        class="receivedStream"
        autoplay
      />
      <StreamsWrapper ref="webcamStreamsWrapper" class="stream-wrapper" />
    </div>
  </div>
</template>

<script>
import Peer from 'simple-peer'

import StreamsWrapper from '~/components/StudyComponents/StreamsWrapper'
import Whiteboard from '~/components/StudyComponents/Whiteboard'
import CodeEditor from '~/components/StudyComponents/CodeEditor'
import Chat from '~/components/StudyComponents/Chat'
import { mapState } from 'vuex'

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
import ChatIcon from '~/static/Icons/chat.svg?inline'

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
    CodeEditor,
    Chat,
    ChatIcon
  },
  data() {
    return {
      apiStaticUrl: '',
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
      chatboxOpen: false,
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
      screenVideoContainer: null,
      onlineUsers: [],
      stream: null,
      client: {},
      receivedStream: null,
      initiator: false,
      connection: null,
      isClassroomTeacher: false
    }
  },
  sockets: {
    class_active_users(activeUsers) {
      this.onlineUsers = activeUsers
    },
    backAnswer(data) {
      this.signalAnswer(data)
    },
    sessionActive() {
      this.sessionActive()
    },
    backOffer(data) {
      this.frontAnswer(data)
    },
    createPeer() {
      this.makePeer()
    }
  },
  computed: mapState({
    user: state => state.user,
    currentlyViewingClass: state => state.currentlyViewingClass
  }),
  methods: {
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
    },

    async startScreenSharing() {
      try {
        // this.stream = await navigator.mediaDevices.getDisplayMedia(
        //   this.displayMediaOptions
        // )
        // this.screenVideoContainer.srcObject = this.stream
        // this.$socket.emit('makeConnection', {
        //   classroomId: this.$route.params.classroomId
        // })
        this.$socket.emit('class_streaming_started', {
          classroomName: this.currentlyViewingClass.name,
          classroomId: this.currentlyViewingClass._id,
          classroomTeacher: this.currentlyViewingClass.createdBy.name
        })
      } catch (error) {
        console.error(error)
      }
    }
  },
  mounted() {
    this.screenVideoContainer = document.getElementById('teacher-screen-video')

    if (this.currentlyViewingClass.createdBy !== undefined) {
      this.isClassroomTeacher =
        this.currentlyViewingClass.createdBy._id === this.user._id
    }

    // if (!this.isClassroomTeacher) {
    this.connection = new RTCMultiConnection()
    this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/'
    this.connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    }

    this.connection.session = {
      audio: true,
      video: true
    }

    this.connection.onstream = function(event) {
      console.log('new stream event ', event)
      // this.screenVideoContainer.srcObject = event.stream

      if (this.isClassroomTeacher) {
        if (event.type === 'local') {
          document.getElementById('teacher-screen-video').srcObject =
            event.stream
        } else {
          document.querySelector('.receivedStream').srcObject = event.stream
        }
      } else {
        if (event.type === 'local') {
          document.querySelector('.receivedStream').srcObject = event.stream
        } else {
          document.getElementById('teacher-screen-video').srcObject =
            event.stream
        }
      }
    }
    this.connection.openOrJoin(this.$route.params.classroomId)
    // }

    this.apiStaticUrl = process.env.baseUrl
    // if (!this.isClassroomTeacher) {
    //   this.$socket.emit('join_class', {
    //     classroomId: this.$route.params.classroomId,
    //     isClassroomTeacher: this.isClassroomTeacher
    //   })
    // }
    this.$socket.emit('get_all_online_users', this.$route.params.classroomId)
  }

  // beforeMount() {
  //   window.addEventListener('beforeunload', event => {
  //     this.$socket.emit('leave_classroom', this.$route.params.classroomId)
  //   })
  // },
  // beforeRouteLeave(to, from, next) {
  //   this.$socket.emit('leave_classroom', this.$route.params.classroomId)
  // }
}
</script>

<style lang="scss" scoped>
.currentlyActive {
  fill: rgb(226, 46, 46);
}
</style>