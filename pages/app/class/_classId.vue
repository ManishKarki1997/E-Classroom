<template>
  <div id="classroom-detailed-view">
    <div class="class-navigation">
      <ul>
        <li @click="gotoLiveClass" v-if="isTeacher || hasJoinedClass">
          <nuxt-link to>
            <AirplayIcon />
            <p>Live</p>
          </nuxt-link>
        </li>
        <li @click="goto('info')">
          <nuxt-link to>
            <InfoIcon />
            <p>Info</p>
          </nuxt-link>
        </li>
        <li @click="goto('pending-requests')" v-if="isTeacher">
          <nuxt-link to>
            <LayersIcon />
            <p>Pending Requests</p>
            <div class="class-tab-badge-wrapper" v-if="isTeacher">
              <span>{{
                currentlyViewingClass.pendingJoinRequests.length
              }}</span>
            </div>
          </nuxt-link>
        </li>
        <li @click="goto('students')" v-if="isTeacher || hasJoinedClass">
          <nuxt-link to>
            <UsersIcon />
            <p>Students</p>
            <div class="class-tab-badge-wrapper" v-if="isTeacher">
              <span>{{ currentlyViewingClass.users.length }}</span>
            </div>
          </nuxt-link>
        </li>
        <li @click="goto('resources')" v-if="isTeacher || hasJoinedClass">
          <nuxt-link to>
            <FolderIcon />
            <p>Resources</p>
            <div class="class-tab-badge-wrapper" v-if="isTeacher">
              <span>{{ currentlyViewingClass.resources.length }}</span>
            </div>
          </nuxt-link>
        </li>
        <li @click="goto('announcements')" v-if="isTeacher || hasJoinedClass">
          <nuxt-link to>
            <RSSIcon />
            <p>Announcements</p>
            <div class="class-tab-badge-wrapper" v-if="isTeacher">
              <span>{{ currentlyViewingClass.announcements.length }}</span>
            </div>
          </nuxt-link>
        </li>
        <li @click="goto('assignments')" v-if="isTeacher || hasJoinedClass">
          <nuxt-link to>
            <ClipboardIcon />
            <p>Assignments</p>
          </nuxt-link>
        </li>
        <li @click="goto('chat')" v-if="isTeacher || hasJoinedClass">
          <nuxt-link to>
            <MessageCircleIcon />
            <p>Chat</p>
          </nuxt-link>
        </li>
      </ul>
    </div>
    <div class="class-detail-content">
      <nuxt-child />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AirplayIcon from '~/static/Icons/airplay.svg?inline'
import InfoIcon from '~/static/Icons/info.svg?inline'
import LayersIcon from '~/static/Icons/layers.svg?inline'
import UsersIcon from '~/static/Icons/users.svg?inline'
import FolderIcon from '~/static/Icons/folder.svg?inline'
import RSSIcon from '~/static/Icons/rss.svg?inline'
import ClipboardIcon from '~/static/Icons/clipboard.svg?inline'
import MessageCircleIcon from '~/static/Icons/message-circle.svg?inline'

export default {
  components: {
    AirplayIcon,
    LayersIcon,
    UsersIcon,
    FolderIcon,
    RSSIcon,
    InfoIcon,
    MessageCircleIcon,
    ClipboardIcon,
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['currentlyViewingClass', 'user']),
    isTeacher() {
      return this.currentlyViewingClass?.createdBy?._id === this?.user?._id
    },
    hasJoinedClass() {
      return this.currentlyViewingClass?.users.indexOf(this?.user?._id) > -1
    },
  },
  methods: {
    gotoLiveClass() {
      this.$router.push(`/app/class/live/${this.currentlyViewingClass._id}`)
    },
    goto(route) {
      this.$router.push(`/app/class/${this.currentlyViewingClass._id}/${route}`)
    },
  },
  mounted() {
    this.$socket.emit('join_class', {
      classroomId: this.currentlyViewingClass._id,
      userId: this?.user?._id,
    })
  },
}
</script>

<style lang="scss" scoped>
#classroom-detailed-view {
  width: 100%;

  .class-navigation {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 4rem;
    width: 100%;
    background-color: var(--accent-background-color);
    border-radius: 5px;
    color: var(--opposite-font-color);
    position: sticky;
    top: 0;
    left: 1rem;
    ul {
      display: flex;
      align-items: center;
      // justify-content: space-around;
      padding: 8px 2rem;
      width: 100%;

      li {
        display: flex;
        align-items: center;
        margin-right: 2rem;
        position: relative;

        a {
          display: flex;
          align-items: center;
          svg {
            stroke: var(--opposite-font-color);
          }
          p {
            margin-left: 8px;
            color: var(--opposite-font-color);
          }
        }

        .class-tab-badge-wrapper {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          top: -8px;
          right: 0;
          background-color: var(--primary-background-color);
          span {
            font-size: 12px;
            color: var(--primary-font-color);
          }
        }
      }
    }
  }

  .class-detail-content {
    padding: 1rem 0;
    overflow: hidden;
  }
}
</style>
