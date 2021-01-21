<template>
  <div id="live-class-page">
    <div class="live-class--left">
      <div class="class-controls-wrapper">
        <ul class="class-controls">
          <li
            class="class-control"
            :class="{
              iconSelected: activeClassControlButtons.indexOf('WEBCAM') > -1,
            }"
          >
            <VideoOnIcon
              @click="handleUserWebcam"
              v-tooltip.top-end="{
                content: 'Broadcast webcam',
                classes: ['info'],
              }"
            />
          </li>
          <!-- <li class="class-control">
            <VideoOffIcon />
          </li>-->

          <li
            class="class-control"
            :class="{
              iconSelected:
                activeClassControlButtons.indexOf('SCREEN_SHARE') > -1,
            }"
            v-tooltip.top-end="{
              content: 'Broadcast screen',
              classes: ['info'],
            }"
          >
            <CastIcon @click="handleScreenShare" />
          </li>
          <!-- <li class="class-control"  v-tooltip.top-start="{
          content: 'Toggle Mic',
          classes: ['info'],
        }">
            <MicOnIcon />
          </li>-->
        </ul>
        <ul
          class="class-collapsible-items-toggler"
          :class="{ collapsibleExpand }"
        >
          <!-- <li :class="{ iconSelected: activeTab === 'online_users' }">
            <UsersIcon @click="tabButtonClicked('online_users')" />
          </li>-->
          <li
            :class="{ iconSelected: activeTab === 'chat' }"
            v-tooltip.top-start="{
              content: 'Live Chat',
              classes: ['info'],
            }"
          >
            <MessageCircleIcon @click="tabButtonClicked('chat')" />
          </li>
          <li
            :class="{ iconSelected: activeTab === 'code_editor' }"
            v-tooltip.top-start="{
              content: 'Code Editor',
              classes: ['info'],
            }"
          >
            <CodeIcon @click="tabButtonClicked('code_editor')" />
          </li>
          <li
            :class="{ iconSelected: activeTab === 'whiteboard' }"
            v-tooltip.top-start="{
              content: 'Whiteboard',
              classes: ['info'],
            }"
          >
            <SquareIcon @click="tabButtonClicked('whiteboard')" />
          </li>
          <li
            :class="{ iconSelected: activeTab === 'studentsWebcamVideo' }"
            v-tooltip.top-start="{
              content: 'Students Webcam Feed',
              classes: ['info'],
            }"
          >
            <CircleIcon @click="tabButtonClicked('studentsWebcamVideo')" />
          </li>
          <li
            v-tooltip.top-start="{
              content: 'Swap Stream',
              classes: ['info'],
            }"
          >
            <RepeatIcon @click="swapStream" />
          </li>
        </ul>
      </div>

      <div class="video-wrapper--big">
        <video
          :controls="!isTeacher && streams.remoteStreams.first.stream"
          :muted="isTeacher"
          autoplay
          class="video--big"
        ></video>
      </div>
    </div>
    <div class="live-class--right">
      <OnlineUsers />
      <div class="teacher-video--small">
        <video
          :controls="!isTeacher && streams.remoteStreams.second.stream"
          :muted="isTeacher"
          autoplay
          class="teacher-video-wrapper--small"
        ></video>
      </div>
      <div class="local-video--small">
        <video autoplay muted class="local-video-wrapper--small"></video>
      </div>
    </div>

    <div class="collapsible-contents-wrapper" :class="{ collapsibleExpand }">
      <div class="tabs-button-wrapper">
        <!-- <div
          :class="{ activeTab: activeTab === 'online_users' }"
          class="tab-button-wrapper"
          @click="tabButtonClicked('online_users')"
        >
          <UsersIcon />
          <p v-if="activeTab === 'online_users'">Online Users</p>
        </div>-->
        <div
          :class="{ activeTab: activeTab === 'chat' }"
          class="tab-button-wrapper"
          @click="tabButtonClicked('chat')"
        >
          <MessageCircleIcon />
          <p v-if="activeTab === 'chat'">Chat</p>
        </div>
        <div
          :class="{ activeTab: activeTab === 'code_editor' }"
          class="tab-button-wrapper"
          @click="tabButtonClicked('code_editor')"
        >
          <CodeIcon />
          <p v-if="activeTab === 'code_editor'">Code Editor</p>
        </div>

        <div
          :class="{ activeTab: activeTab === 'whiteboard' }"
          class="tab-button-wrapper"
          @click="tabButtonClicked('whiteboard')"
        >
          <SquareIcon />
          <p v-if="activeTab === 'whiteboard'">Whiteboard</p>
        </div>

        <div
          :class="{ activeTab: activeTab === 'studentsWebcamVideo' }"
          class="tab-button-wrapper"
          @click="tabButtonClicked('studentsWebcamVideo')"
        >
          <CircleIcon />
          <p v-if="activeTab === 'studentsWebcamVideo'">Students Video Feed</p>
        </div>
      </div>

      <div class="tabs-content-wrapper">
        <div v-if="activeTab === 'chat'" class="class-chat-wrapper">
          <Chat />
        </div>
        <CodeEditor v-if="activeTab === 'code_editor'" />
        <Whiteboard v-if="activeTab === 'whiteboard'" />
        <div
          id="student-webcam-videos-wrapper"
          v-show="activeTab === 'studentsWebcamVideo'"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TickIcon from '~/static/Icons/check.svg?inline'
import CastIcon from '~/static/Icons/cast.svg?inline'
import SquareIcon from '~/static/Icons/square.svg?inline'
import MessageCircleIcon from '~/static/Icons/message-circle.svg?inline'
import UsersIcon from '~/static/Icons/users.svg?inline'
import CodeIcon from '~/static/Icons/code.svg?inline'
import MicOnIcon from '~/static/Icons/mic.svg?inline'
import MicOffIcon from '~/static/Icons/mic-off.svg?inline'
import VideoOnIcon from '~/static/Icons/video.svg?inline'
import VideoOffIcon from '~/static/Icons/video-off.svg?inline'
import RepeatIcon from '~/static/Icons/repeat.svg?inline'
import CircleIcon from '~/static/Icons/circle.svg?inline'

import Chat from '~/components/LiveClass/LiveChat'
import Whiteboard from '~/components/LiveClass/Whiteboard'
import OnlineUsers from '~/components/LiveClass/OnlineUsers'
import CodeEditor from '~/components/LiveClass/CodeEditor'
import OnlineUsersVideoFeeds from '~/components/LiveClass/OnlineUsersVideoFeeds'

import SimplePeer from 'simple-peer'

export default {
  components: {
    CastIcon,
    TickIcon,
    CastIcon,
    MessageCircleIcon,
    UsersIcon,
    RepeatIcon,
    CodeIcon,
    MicOnIcon,
    SquareIcon,
    MicOffIcon,
    VideoOnIcon,
    VideoOffIcon,
    CircleIcon,
    Chat,
    OnlineUsers,
    CodeEditor,
    Whiteboard,
    OnlineUsersVideoFeeds,
  },
  data() {
    return {
      activeTab: '',
      collapsibleExpand: false,
      activeNormalTab: 'chat',
      constraints: {
        audio: false,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      },
      connection: null,
      localStream: null,
      activeClassControlButtons: [],
      bigScreenWrapper: null,
      localSmallStreamScreenWrapper: null,
      remoteSmallScreenWrapper: null,
      streamIds: {
        teacherWebcamStreamId: '',
        teacherScreenCamStreamId: '',
      },
      recentlyRemovedStreamId: '',
      studentsWebcamVideos: [],
      streams: {
        remoteStreams: {
          first: {
            id: '',
            stream: null,
          },
          second: {
            id: '',
            stream: null,
          },
        },
        localStream: null,
      },
    }
  },
  computed: {
    ...mapGetters(['user', 'currentlyViewingClass']),
    isTeacher() {
      return this.currentlyViewingClass.createdBy._id === this.user._id
    },
  },
  sockets: {},
  methods: {
    tabButtonClicked(tabButton) {
      if (this.activeTab === tabButton) {
        this.collapsibleExpand = !this.collapsibleExpand
        this.activeTab = ''
      } else {
        this.collapsibleExpand = true
        this.activeTab = tabButton
      }
    },
    swapStream() {
      const tempStream = this.streams.remoteStreams.first
      console.log(this.streams.remoteStreams.first)
      console.log(this.streams.remoteStreams.second)
      this.streams.remoteStreams.first = {
        ...this.streams.remoteStreams.second,
      }

      // this.streams.remoteStreams.first.stream = this.streams.remoteStreams.second.stream
      // this.streams.remoteStreams.first.id = this.streams.remoteStreams.second.id

      this.streams.remoteStreams.second = { ...tempStream }

      this.remoteSmallScreenWrapper.srcObject = this.streams.remoteStreams.first.stream
      this.bigScreenWrapper.srcObject = this.streams.remoteStreams.second.stream

      this.remoteSmallScreenWrapper.classList.add(
        `stream-id-${this.streams.remoteStreams.first.id}`
      )
      this.bigScreenWrapper.classList.add(
        `stream-id-${this.streams.remoteStreams.second.id}`
      )
    },
    async handleUserWebcam() {
      if (this.activeClassControlButtons.indexOf('WEBCAM') > -1) {
        this.activeClassControlButtons.splice(
          this.activeClassControlButtons.indexOf('WEBCAM'),
          1
        )

        this.connection.removeStream(this.streamIds.teacherWebcamStreamId)
        const videoContainer = document.getElementsByClassName(
          `stream-id-${this.streamIds.teacherWebcamStreamId}`
        )[0]

        if (!videoContainer) return
        videoContainer.pause()
        videoContainer.removeAttribute('src')
        videoContainer.load()
        this.streamIds.teacherWebcamStreamId = ''
        if (
          !this.streams.remoteStreams.first.stream &&
          !this.streams.remoteStreams.second.stream
        ) {
          const that = this
          this.connection.getAllParticipants().forEach(function (pid) {
            that.connection.disconnectWith(pid)
          })

          // stop all local cameras
          this.connection.attachStreams.forEach(function (localStream) {
            localStream.stop()
          })

          // close socket.io connection
          this.connection.closeSocket()
        }
      } else {
        this.activeClassControlButtons.push('WEBCAM')
        try {
          this.connection = new RTCMultiConnection()
          this.connection.socketURL =
            'https://rtcmulticonnection.herokuapp.com:443/'
          this.connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true,
          }

          this.connection.session = {
            audio: false,
            video: true,
          }

          this.connection.extra = {
            sentByTeacher: true,
            screenShare: false,
            webcamShare: true,
          }

          this.connection.mediaConstraints = {
            audio: false,
            video: true,
            // video: {
            //   mandatory: {
            //     minWidth: 720,
            //     maxWidth: 1280,
            //     minHeight: 720,
            //     maxHeight: 1280,
            //   },
            // },
          }

          this.connection.openOrJoin(this.$route.params.classId)

          const that = this

          this.connection.onstream = function (event) {
            if (
              event.type === 'local' &&
              document.querySelector('.video--big').srcObject === null
            ) {
              that.streamIds.teacherWebcamStreamId = event.streamid
              document.querySelector('.video--big').srcObject = event.stream
              document
                .querySelector('.video--big')
                .classList.add(`stream-id-${event.streamid}`)
              // that.streams.teacherStream.webcamStream.stream = event.stream
              // that.streams.teacherStream.webcamStream.streamId = event.streamid
            } else if (
              event.type === 'local' &&
              document.querySelector('.local-video--small').srcObject !== null
            ) {
              document.querySelector('.local-video--small').srcObject =
                event.stream
              document
                .querySelector('.local-video--small')
                .classList.add(`stream-id-${event.streamid}`)
              that.streamIds.teacherWebcamStreamId = event.streamid
            } else {
              const videoElement = document.createElement('video')
              videoElement.srcObject = event.stream
              videoElement.classList.add('student-video-stream')
              videoElement.setAttribute('id', event.streamid)
              setTimeout(() => {
                document
                  .getElementById('student-webcam-videos-wrapper')
                  .append(videoElement)
                videoElement.play()
              }, 3000)

              // document
              //   .getElementById('student-webcam-videos-wrapper')
              //   .append(event.mediaElement)
            }
          }
        } catch (error) {
          console.error(error)
        }
      }
    },
    handleScreenShare() {
      if (this.activeClassControlButtons.indexOf('SCREEN_SHARE') > -1) {
        // this.stopScreenSharing()
        this.activeClassControlButtons.splice(
          this.activeClassControlButtons.indexOf('SCREEN_SHARE'),
          1
        )
      } else {
        this.startScreenSharing()
        this.activeClassControlButtons.push('SCREEN_SHARE')
      }
      // this.startScreenSharing()
    },
    async startScreenSharing() {
      const that = this

      // if the user is already sharing the webcam, append the screen sharing stream to the webcam connection
      if (this.activeClassControlButtons.indexOf('WEBCAM') > -1) {
        this.connection.session = {
          screen: true,
          oneway: true,
          audio: true,
        }

        // connection.sdpConstraints.mandatory = {
        //   OfferToReceiveAudio: true,
        //   OfferToReceiveVideo: true,
        // }

        this.connection.mediaConstraints = {
          audio: true,
          video: true,
        }

        this.connection.addStream({
          screen: true,
          oneway: false,
          audio: true,

          streamCallback: function (stream) {
            document.querySelector(
              '.local-video-wrapper--small'
            ).srcObject = stream
            document.querySelector('.local-video-wrapper--small').muted = true
            that.streams.remoteStreams.second = stream
            that.streams.remoteStreams.id = stream.id
            that.streamIds.teacherScreenCamStreamId = stream.streamid
          },
        })
      } else {
        // if the user hasn't shared webcam before, start a new connection
        this.connection = new RTCMultiConnection()
        this.connection.socketURL =
          'https://rtcmulticonnection.herokuapp.com:443/'

        this.connection.session = {
          screen: true,
          oneway: false,
          audio: true,
        }

        // this.connection.sdpConstraints.mandatory = {
        //   OfferToReceiveAudio: true,
        //   OfferToReceiveVideo: true,
        // }
        this.connection.mediaConstraints = {
          audio: true,
          video: false,
        }

        this.connection.extra = {
          sentByTeacher: true,
          screenShare: true,
          webcamShare: false,
        }
        this.connection.openOrJoin(this.$route.params.classId)

        this.connection.onstream = function (event) {
          console.log(event)
          // document.querySelector('.teacher-video-wrapper--small').append(even)
          if ('srcObject' in this.localSmallStreamScreenWrapper) {
            console.log('if')
            this.localSmallStreamScreenWrapper.srcObject = event.stream
          } else {
            console.log('else')
            // Avoid using this in new browsers, as it is going away.
            this.localSmallStreamScreenWrapper.src = URL.createObjectURL(
              event.stream
            )
          }
          // this.localSmallStreamScreenWrapper.srcObject = event.stream
          // that.displayVideo(event)
        }
      }
    },
    displayVideo(event) {
      // console.log(event)
      if (event.type === 'local' && event.extra.sentByTeacher === undefined) {
        this.streams.localStream = event.stream
        this.localSmallStreamScreenWrapper.srcObject = event.stream
      } else {
        if (
          event.type === 'remote' &&
          event.extra.sentByTeacher !== undefined &&
          event.extra.sentByTeacher &&
          this.streams.remoteStreams.first.stream === null
        ) {
          this.streams.remoteStreams.first.stream = event.stream
          this.streams.remoteStreams.first.id = event.streamid
          this.bigScreenWrapper.srcObject = this.streams.remoteStreams.first.stream
          this.bigScreenWrapper.classList.add(`stream-id-${event.streamid}`)
        } else if (
          event.type === 'remote' &&
          event.extra.sentByTeacher !== undefined &&
          event.extra.sentByTeacher &&
          this.streams.remoteStreams.first.stream !== null
        ) {
          this.remoteSmallScreenWrapper.classList.add(
            `stream-id-${event.streamid}`
          )

          this.streams.remoteStreams.second.stream = event.stream
          this.streams.remoteStreams.second.id = event.streamid
          this.remoteSmallScreenWrapper.srcObject = this.streams.remoteStreams.second.stream
        }
      }
    },
  },
  mounted() {
    this.bigScreenWrapper = document.querySelector('.video--big')
    this.localSmallStreamScreenWrapper = document.querySelector(
      '.local-video-wrapper--small'
    )

    this.remoteSmallScreenWrapper = document.querySelector(
      '.teacher-video-wrapper--small'
    )

    this.$socket.emit('join_class', {
      classroomId: this.$route.params.classId,
      uesr: { ...this.user },
    })

    this.$socket.emit('get_all_online_users', this.$route.params.classId)
    if (this.currentlyViewingClass.createdBy._id !== this.user._id) {
      this.connection = new RTCMultiConnection()

      this.connection.socketURL =
        'https://rtcmulticonnection.herokuapp.com:443/'
      // this.connection.sdpConstraints.mandatory = {
      //   OfferToReceiveAudio: true,
      //   OfferToReceiveVideo: true,
      // }

      // this.connection.session = {
      //   audio: true,
      //   video: true,
      // }

      // this.connection.mediaConstraints = {
      //   audio: false,
      //   video: true,
      // }
      this.connection.openOrJoin(this.$route.params.classId)

      const that = this
      this.connection.onstream = function (event) {
        if (this.recentlyRemovedStreamId === event.streamid) return
        that.displayVideo(event)

        // that.localStream = event.stream
        // let videoWrapper = document.querySelector('.video-wrapper--small')
        // videoWrapper.srcObject = event.stream
      }

      this.connection.onstreamended = function (event) {
        this.recentlyRemovedStreamId = event.streamid
        const videoContainer = document.getElementsByClassName(
          `stream-id-${event.streamid}`
        )[0]

        videoContainer.pause()
        videoContainer.removeAttribute('src')
        videoContainer.load()
      }
    }
  },
}
</script>

<style lang="scss" scoped>
svg {
  cursor: pointer;
}

.iconSelected {
  svg {
    stroke: var(--accent-background-color);
  }
}
#live-class-page {
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  padding: 0;
  overflow: hidden !important;

  .live-class--left {
    width: 75%;
    min-height: 100vh;

    .class-controls-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 3rem;
      width: 100%;
      padding: 1rem 3rem;
      background-color: var(--primary-background-color);
      @include normalBoxShadow;

      ul.class-controls {
        display: flex;
        align-items: center;
        margin-left: 4rem;

        .class-control {
          margin-right: 2rem;

          svg {
            width: 24px;
            height: 24px;
            transition: all 0.3s ease-in-out;

            &:hover {
              stroke: var(--accent-background-color);
            }
          }
        }
      }

      ul.class-collapsible-items-toggler {
        display: flex;
        align-items: center;
        transition: all 0.3s ease-in-out;

        &.collapsibleExpand {
          padding-right: 13.6rem;
        }

        li {
          margin-left: 2rem;

          svg {
            transition: all 0.3s ease-in-out;
            &:hover {
              stroke: var(--accent-background-color);
            }
          }
        }
      }
    }

    .video-wrapper--big {
      width: 100%;
      height: 100%;

      video {
        width: 100%;
        max-height: 98vh;
      }
    }
  }
  .live-class--right {
    width: 25%;
    height: 100vh;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .online-users-wrapper {
      height: 75%;
      overflow-y: auto;
    }

    .teacher-video--small,
    .local-video--small {
      height: 25%;
      width: 100%;
      overflow: hidden;
      background-color: var(--tertiary-background-color);
      @include hoverBoxShadow;

      video {
        width: 100%;
        height: 100%;
      }
    }
  }

  .collapsible-contents-wrapper {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 200;
    width: 0;
    height: 100%;
    background-color: var(--primary-background-color);
    padding: 1rem;
    visibility: hidden;
    transition: all 0.3s ease-in-out;

    &.collapsibleExpand {
      width: 40%;
      visibility: visible;
    }

    .tabs-button-wrapper {
      display: flex;
      align-items: center;
      border-radius: 5px;
      background-color: var(--secondary-background-color);
      justify-content: space-between;
      margin-bottom: 1rem;

      .tab-button-wrapper {
        display: flex;
        align-items: center;
        border-radius: 5px;
        padding: 12px;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        color: var(--primary-font-color);

        &.activeTab {
          background-color: var(--accent-background-color);
          color: var(--opposite-font-color);
          width: 70%;
          position: relative;
          z-index: 100;
          color: var(--opposite-font-color);

          &:hover {
            svg {
              stroke: var(--opposite-font-color);
            }
          }
        }

        &:hover {
          svg {
            stroke: var(--accent-background-color);
          }
        }
        svg {
          margin-right: 8px;
        }
      }
    }

    .tabs-content-wrapper {
      height: 90%;
      .class-chat-wrapper {
        height: 100%;

        .class-chat-body {
          height: 100%;
          overflow-y: auto;
          .messages {
            height: 90% !important;
          }
          form {
            height: 10% !important;
          }
        }
      }

      #student-webcam-videos-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;

        video {
          width: 300px;
          height: 300px;
          margin: 1rem 0;
        }
      }
    }
  }
}
</style>
