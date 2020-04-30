<template>
  <div id="classroom">
    <div class="teacher-screen">
      <!-- <button @click="startScreenSharing">Start Capture</button>
      <button @click="stopScreenSharing">Stop Capture</button>-->
      <div class="classroom-action-buttons-wrapper">
        <div v-if="isClassroomTeacher" class="camera-actions">
          <!-- <p style="margin-right:12px;">Share</p> -->
          <!-- <p >Notify</p> -->
          <ShoutIcon
            v-tooltip="{content:'Notify Students',offset:'26px'}"
            style="width:16px;height:16px;"
            @click="notifyClassStart"
          />
          <WebcamIcon
            v-tooltip="{content:'Share Webcam',offset:'26px'}"
            style="width:16px;height:16px;"
            @click="handleWebcamSharing"
            :class="{currentlyActive:webcamSharing.highlightIcon}"
          />
          <TelevisionIcon
            v-tooltip="{content:'Share Screen',offset:'26px'}"
            style="width:16px;height:16px;"
            @click="handleScreenSharing"
            :style="{classroomIconActive:screenSharing.highlightIcon}"
            :class="{currentlyActive:screenSharing.highlightIcon}"
          />
        </div>
        <div class="floating-window-actions">
          <p style="margin-right:12px;">Tools</p>
          <WhiteboardIcon
            v-tooltip="{content:'Open Whiteboard',offset:'26px'}"
            style="width:16px;height:16px;"
            :class="{currentlyActive:whiteboardOpen}"
            @click="toggleWhiteboard"
          />
          <CodeEditorIcon
            v-tooltip="{content:'Open Editor',offset:'26px'}"
            v-if="isClassroomTeacher"
            :class="{currentlyActive:codeEditorOpen}"
            @click="toggleCodeEditor"
          />
          <ChatIcon
            v-tooltip="{content:'Open Chat',offset:'26px'}"
            :class="{currentlyActive:chatboxOpen,openChat:chatboxOpen}"
            @click="chatboxOpen=!chatboxOpen"
          />
          <SwapIcon v-tooltip="{content:'Swap Stream',offset:'26px'}" @click="determineSwap" />
        </div>
      </div>

      <Whiteboard v-if="whiteboardOpen" />
      <!-- <Whiteboard v-if="whiteboardOpen" /> -->
      <!-- <p
        style="margin-left:1rem;margin-top:1rem; font-size:14px;"
        v-if="!classHasStarted"
      >Start the classroom by broadcasting yourself or your screen by clicking on the Share icons above.</p>-->
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
        <h4>Online</h4>
        <ul class="online-students">
          <li v-for="onlineUser in onlineUsers" :key="onlineUser.email">
            <div class="online-student-info">
              <img :src="apiStaticUrl + '/uploads/images/' + onlineUser.avatar" />
              <!-- <img src="~/static/Images/Saber.jpg" alt="user picture" /> -->
              <p>{{onlineUser.name}}</p>
            </div>
            <!-- <div class="communication-request-action-buttons">
              <CheckMarkIcon />
              <CloseIcon />
            </div>-->
          </li>
        </ul>
      </div>

      <!-- <div class="video-wrapper"></div> -->
      <div>
        <!-- <p>Teacher's webcam view</p> -->
        <video style="width:100%; max-height:230px;" class="receivedStream" autoplay />
      </div>
      <div>
        <!-- <p>My Screen View</p> -->
        <video style="width:100%;height:100%;" id="my-webcam-view" autoplay />
      </div>
      <!-- <StreamsWrapper ref="webcamStreamsWrapper" class="stream-wrapper" /> -->
    </div>
  </div>
</template>

<script>
import Peer from 'simple-peer'

import StreamsWrapper from '~/components/StudyComponents/StreamsWrapper'
// import Whiteboard from '~/components/StudyComponents/Whiteboard'
import Whiteboard from '~/components/StudyComponents/Whiteboard1'
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
import ShoutIcon from '~/static/Icons/shout.svg?inline'
import SwapIcon from '~/static/Icons/swap.svg?inline'

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
    ChatIcon,
    ShoutIcon,
    SwapIcon
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
      isClassroomTeacher: false,
      classHasStarted: false,
      streams: {
        remoteStreams: {
          first: null,
          second: null
        },
        localStream: null
      },
      receivedStreamContainer: null,
      mainTeacherViewContainer: null,
      teacherSharedWebcam: false,
      teacherSharedScreen: false
    }
  },
  sockets: {
    class_active_users(activeUsers) {
      this.onlineUsers = activeUsers
    }
  },
  computed: mapState({
    user: state => state.user,
    currentlyViewingClass: state => state.currentlyViewingClass
  }),
  methods: {
    determineSwap() {
      this.isClassroomTeacher ? this.teacherSwapStream() : this.swapStream()
    },
    teacherSwapStream() {
      try {
        let webcamStream = document.querySelector('#my-webcam-view')
        let mainStream = document.querySelector('#teacher-screen-video')
        let tempStreamContainer = webcamStream.srcObject || mainStream.srcObject
        // if both sources are null, alert the user to at least share one stream
        if (webcamStream.srcObject === null && mainStream.srcObject === null) {
          let message = ''
          if (this.isClassroomTeacher) {
            message = 'Please share at least one stream first!'
          } else {
            message = 'No stream has been shared'
          }
          this.$toast.open({
            type: 'error',
            message,
            position: 'top-right',
            duration: 1500
          })
          return false
        } else {
          console.log(tempStreamContainer)
          webcamStream.srcObject = mainStream.srcObject
          mainStream.srcObject = tempStreamContainer
        }
        // console.log(tempStreamContainer)
      } catch (error) {
        console.error(error)
      }
    },
    swapStream() {
      if (
        this.streams.remoteStreams.first !== null &&
        this.streams.remoteStreams.second !== null
      ) {
        const tempStreamContainer = this.streams.remoteStreams.first
        this.streams.remoteStreams.first = this.streams.remoteStreams.second
        this.streams.remoteStreams.second = tempStreamContainer

        // this.receivedStreamContainer.pause()
        this.receivedStreamContainer.srcObject = this.streams.remoteStreams.first
        this.mainTeacherViewContainer.srcObject = this.streams.remoteStreams.second
      }
    },
    notifyClassStart() {
      this.classHasStarted = true
      this.$socket.emit('class_streaming_started', {
        classroomName: this.currentlyViewingClass.name,
        classroomId: this.currentlyViewingClass._id,
        classroomTeacher: this.currentlyViewingClass.createdBy.name,
        classroomImage: this.currentlyViewingClass.backgroundImage,
        startTime: new Date().getTime()
      })
    },
    stopScreenSharing() {
      let tracks = this.screenVideoContainer.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      this.screenVideoContainer.srcObject = null
    },
    handleScreenSharing() {
      if (this.screenSharing.share) {
        // this.stopScreenSharing()
        alert('screen sharing stopped')
        this.screenSharing.highlightIcon = false
      } else {
        this.startScreenSharing()
        this.screenSharing.highlightIcon = true
      }

      this.screenSharing.share = !this.screenSharing.share
    },
    handleWebcamSharing() {
      // teacher-screen-stream
      if (this.webcamSharing.share == true) {
        // this.$refs.webcamStreamsWrapper.stopCameraShare()
        this.connection.streamEvents
          .selectAll({ local: true })
          .forEach(function(streamEvent) {
            // console.log(streamEvent)
            streamEvent.stream.getAudioTracks()[0].stop()
            streamEvent.stream.getVideoTracks()[0].stop()
          })
        this.connection.removeStream(
          this.streams.teacherStream.webcamStream.streamId
        )

        this.webcamSharing.highlightIcon = false
      } else {
        // this.$refs.webcamStreamsWrapper.shareCameraStream()
        try {
          // this.stream = await navigator.mediaDevices.getDisplayMedia(
          //   this.displayMediaOptions
          // )
          // this.screenVideoContainer.srcObject = this.stream
          // this.$socket.emit('makeConnection', {
          //   classroomId: this.$route.params.classroomId
          // })
          this.connection = new RTCMultiConnection()
          this.connection.socketURL =
            'https://rtcmulticonnection.herokuapp.com:443/'
          this.connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
          }

          this.connection.session = {
            audio: true,
            video: true
          }

          this.connection.extra = {
            sentByTeacher: true,
            screenShare: false,
            webcamShare: true
          }

          this.connection.mediaConstraints = {
            audio: true,
            video: {
              mandatory: {
                minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 1280
              }
            }
          }

          this.connection.openOrJoin(this.$route.params.classroomId)

          const that = this

          this.connection.onstream = function(event) {
            // this.screenVideoContainer.srcObject = event.stream
            if (
              event.type === 'local' &&
              document.getElementById('my-webcam-view').srcObject === null
            ) {
              document.getElementById('my-webcam-view').srcObject = event.stream
              // console.log(event)
              that.streams.teacherStream.webcamStream.stream = event.stream
              that.streams.teacherStream.webcamStream.streamId = event.streamid
            } else if (
              event.type === 'local' &&
              document.getElementById('my-webcam-view').srcObject !== null
            ) {
              document.getElementById('teacher-screen-video').srcObject =
                event.stream

              that.streams.teacherStream.screenStream.stream = event.stream
              that.streams.teacherStream.screenStream.streamId = event.streamid
            }
          }
        } catch (error) {
          console.error(error)
        }
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
    displayVideo(event) {
      if (event.type === 'local') {
        // console.log(event)
        this.streams.localStream = event.streamid
        this.streams.localStream = event.stream
        document.getElementById(
          'my-webcam-view'
        ).srcObject = this.streams.localStream
      } else {
        if (
          event.type === 'remote' &&
          event.extra.sentByTeacher !== undefined &&
          event.extra.sentByTeacher &&
          this.streams.remoteStreams.first === null
        ) {
          this.streams.remoteStreams.first = event.stream

          this.mainTeacherViewContainer.srcObject = this.streams.remoteStreams.first
          this.mainTeacherViewContainer.classList.add(event.streamid)
          // that.streams.teacherStream.webcamStream.stream = event.stream
          // that.streams.teacherStream.streamId = event.streamid
        } else if (
          event.type === 'remote' &&
          event.extra.sentByTeacher !== undefined &&
          event.extra.sentByTeacher &&
          this.streams.remoteStreams.first !== null
        ) {
          this.receivedStreamContainer.classList.add(event.streamid)

          this.streams.remoteStreams.second = event.stream
          this.receivedStreamContainer.srcObject = this.streams.remoteStreams.second
        }
      }
    },

    async startScreenSharing() {
      const that = this
      if (this.webcamSharing.highlightIcon) {
        this.connection.mediaConstraints = {
          audio: true,
          video: {
            mandatory: {
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 1280,
              maxHeight: 1280
            }
          }
        }

        this.connection.addStream({
          screen: true,
          oneway: true,
          streamCallback: function(stream) {
            document.getElementById('teacher-screen-video').srcObject = stream

            that.streams.teacherStream.screenStream.stream = stream

            that.streams.teacherStream.screenStream.streamId = stream.streamid
          }
        })
      } else {
        this.connection = new RTCMultiConnection()
        this.connection.socketURL =
          'https://rtcmulticonnection.herokuapp.com:443/'

        this.connection.session = {
          screen: true,
          oneway: true
        }

        this.connection.sdpConstraints.mandatory = {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true
        }
        this.connection.mediaConstraints = {
          audio: true,
          video: {
            mandatory: {
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 1280,
              maxHeight: 1280
            }
          }
        }

        this.connection.extra = {
          sentByTeacher: true,
          screenShare: true,
          webcamShare: false
        }
        this.connection.openOrJoin(this.$route.params.classroomId)

        this.connection.onstream = function(event) {
          that.displayVideo(event)
        }
      }
    }
  },
  mounted() {
    this.apiStaticUrl = process.env.baseUrl
    this.screenVideoContainer = document.getElementById('my-webcam-view')
    this.$socket.emit('get_all_online_users', this.$route.params.classroomId)

    if (this.currentlyViewingClass.createdBy !== undefined) {
      this.isClassroomTeacher =
        this.currentlyViewingClass.createdBy._id === this.user._id
    }

    if (!this.isClassroomTeacher) {
      this.receivedStreamContainer = document.querySelector('.receivedStream')

      this.mainTeacherViewContainer = document.getElementById(
        'teacher-screen-video'
      )
      this.connection = new RTCMultiConnection()

      this.connection.socketURL =
        'https://rtcmulticonnection.herokuapp.com:443/'
      this.connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
      }

      this.connection.session = {
        audio: true,
        video: true
      }
      this.connection.mediaConstraints = {
        audio: true,
        video: {
          mandatory: {
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 860,
            maxHeight: 1280
          },
          optional: []
        }
      }
      this.connection.openOrJoin(this.$route.params.classroomId)

      const that = this

      this.connection.onstreamended = function(event) {
        console.log(event)
        // const doc = document.getElementsByClassName(event.streamid)
        // console.log(doc[0].parentNode)
        // if (doc[0]) {
        //   doc[0].pause()
        //   doc[0].removeAttribute('srcObject')
        //   doc[0].load()
        // }
      }

      this.connection.onstream = function(event) {
        // this.screenVideoContainer.srcObject = event.stream
        that.displayVideo(event)
      }
    }

    // this.$socket.emit('join_class', {
    //   classroomId: this.$route.params.classroomId,
    //   isClassroomTeacher: this.isClassroomTeacher
    // })
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
.tooltip {
  margin-top: 2rem !important;
  color: white !important;
  background-color: white;
}
.currentlyActive {
  fill: rgb(226, 46, 46);
}
#classroom {
  color: black !important;
}
</style>