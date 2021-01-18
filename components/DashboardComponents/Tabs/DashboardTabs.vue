<template>
  <div class="dashboard-tabs-wrapper">
    <div class="buttons-wrapper-main">
      <div class="tabs-button-wrapper">
        <div
          class="active-tab-background"
          :class="activeTab === 'notifications' ? 'mr-auto' : 'ml-auto'"
        ></div>
        <div
          :class="{ activeTab: activeTab === 'notifications' }"
          class="tab-button-wrapper"
          @click="tabButtonClicked('notifications')"
        >
          <BellIcon />
          <p v-if="activeTab === 'notifications'">Notification</p>
        </div>
        <div
          :class="{ activeTab: activeTab === 'announcements' }"
          class="tab-button-wrapper"
          @click="tabButtonClicked('announcements')"
        >
          <RSSIcon />
          <p v-if="activeTab === 'announcements'">Announcements</p>
        </div>
      </div>
      <Notifications v-if="activeTab === 'notifications'" />
      <Announcements v-if="activeTab === 'announcements'" />
    </div>
  </div>
</template>

<script>
import Announcements from './Announcements'
import Notifications from './Notifications'

import BellIcon from '~/static/Icons/bell.svg?inline'
import RSSIcon from '~/static/Icons/rss.svg?inline'

export default {
  components: {
    Notifications,
    Announcements,
    BellIcon,
    RSSIcon,
  },
  data() {
    return {
      activeTab: 'notifications',
    }
  },
  methods: {
    tabButtonClicked(tabButton) {
      this.activeTab = tabButton
    },
  },
}
</script>

<style lang="scss" scoped>
.ml-auto {
  transform: translateX(70px);
}
.mr-auto {
  margin-right: auto;
  transform: translateX(0px);
}

.dashboard-tabs-wrapper {
  .buttons-wrapper-main {
    position: relative;
    max-height: 3rem;

    .tabs-button-wrapper {
      display: flex;
      align-items: center;
      border-radius: 5px;

      // background-color: var(--secondary-background-color);
      justify-content: space-between;
      margin-bottom: 1rem;

      .active-tab-background {
        width: 75%;
        height: 100%;
        border-radius: 5px;
        background-color: #84c1ff;

        // background-color: var(--secondary-background-color);

        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        transition: all 0.3s ease-in-out;
      }

      .tab-button-wrapper {
        display: flex;
        align-items: center;
        border-radius: 5px;
        padding: 12px;
        cursor: pointer;
        transition: all 0.3s ease-in-out;

        &.activeTab {
          // background-color: var(--accent-background-color);
          background-color: #84c1ff;
          background: linear-gradient(
            97deg,
            rgba(132, 193, 255, 1) 0%,
            rgba(132, 193, 255, 1) 72%,
            rgba(124, 189, 255, 1) 100%
          );
          color: var(--opposite-font-color);
          width: 70%;
          position: relative;
          z-index: 100;

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
  }
}
</style>
