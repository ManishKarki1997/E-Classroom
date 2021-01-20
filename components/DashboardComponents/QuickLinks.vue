<template>
  <div class="quick-links" v-if="Object.keys(user).length > 0">
    <div class="quick-link" @click="$router.push('/app/resources')">
      <div class="quick-link-icon-wrapper">
        <FolderIcon />
      </div>
      <div class="quick-link-info">
        <h2>{{ user.resourceFolders.length }}</h2>
        <p>Bookmarked Resources</p>
      </div>
    </div>

    <div class="quick-link" v-if="user.userType === 'TEACHER'">
      <div class="quick-link-icon-wrapper">
        <UsersIcon />
      </div>
      <div class="quick-link-info">
        <h2>{{ user.createdClasses.length }}</h2>
        <p>Teaching Classes</p>
      </div>
    </div>

    <div
      class="quick-link"
      v-if="user.userType === 'STUDENT'"
      @click="$router.push('/app/classes')"
    >
      <div class="quick-link-icon-wrapper">
        <BookOpenIcon />
      </div>
      <div class="quick-link-info">
        <h2>{{ user.joinedClasses.length }}</h2>
        <p>Enrolled Classes</p>
      </div>
    </div>

    <!-- <div class="quick-link" @click="$router.push('/app/settings')">
      <div class="quick-link-icon-wrapper">
        <SettingsIcon />
      </div>
      <div class="quick-link-info">
        <p>Settings</p>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import FolderIcon from '~/static/Icons/folder.svg?inline'
import UserIcon from '~/static/Icons/user.svg?inline'
import UsersIcon from '~/static/Icons/users.svg?inline'
import SettingsIcon from '~/static/Icons/settings.svg?inline'
import BookOpenIcon from '~/static/Icons/book-open.svg?inline'

export default {
  components: {
    FolderIcon,
    UserIcon,
    UsersIcon,
    SettingsIcon,
    BookOpenIcon,
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['user']),
  },
}
</script>

<style lang="scss" scoped>
.quick-links {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 2rem;

  .quick-link {
    grid-column: span 4;
    padding: 1rem;
    @include normalBoxShadow;
    background-color: var(--primary-background-color);
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;

    &:first-child {
      background-color: #84c1ff;
      background: linear-gradient(
        97deg,
        rgba(132, 193, 255, 1) 0%,
        rgba(132, 193, 255, 1) 42%,
        rgba(124, 189, 255, 1) 100%
      );

      stroke: #d6eaff !important;

      .quick-link-icon-wrapper {
        svg {
          stroke: #d6eaff;
        }
      }

      .quick-link-info {
        color: #d6eaff !important;
      }
    }

    &:nth-child(2) {
      background-color: #ffd3b6;
      background: linear-gradient(
        97deg,
        rgba(255, 211, 182, 1) 0%,
        rgba(255, 211, 182, 1) 42%,
        rgba(249, 199, 166, 1) 100%
      );

      .quick-link-icon-wrapper {
        svg {
          stroke: #fff5ee;
        }
      }

      .quick-link-info {
        color: #fff5ee !important;
      }
    }

    &:nth-child(3) {
      background-color: #a8e6cf;
      background: linear-gradient(
        97deg,
        rgba(168, 230, 207, 1) 0%,
        rgba(168, 230, 207, 1) 42%,
        rgba(139, 228, 194, 1) 100%
      );

      .quick-link-icon-wrapper {
        svg {
          stroke: #dbfdf1;
        }
      }

      .quick-link-info {
        color: #dbfdf1 !important;
      }
    }

    &:hover {
      @include hoverBoxShadow;

      .quick-link-icon-wrapper {
        svg {
          stroke: var(--opposite-font-color) !important;
        }
      }

      .quick-link-info {
        color: var(--opposite-font-color) !important;
      }
    }

    .quick-link-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      padding: 1rem;
      margin-right: 8px;
      transition: all 0.3s ease-in-out;

      svg {
        transition: all 0.3s ease-in-out;
      }
    }
  }
}
</style>
