<template>
  <div id="admin-dashboard">
    <div class="dashboard-user-welcome-wrapper">
      <p>Welcome,</p>
      <h2>{{user.name}}</h2>
    </div>
    <div class="dashboard-items">
      <div class="dashboard-item" @click="$router.push('/app/admin/users')">
        <div class="icon-wrapper">
          <UsersIcon />
        </div>
        <div class="item-info">
          <h2>{{documentCounts.totalUsersCounts}}</h2>
          <p>Users</p>
        </div>
      </div>
      <div class="dashboard-item" @click="$router.push('/app/admin/classes')">
        <div class="icon-wrapper">
          <BookOpenIcon />
        </div>
        <div class="item-info">
          <h2>{{documentCounts.totalClassCounts}}</h2>
          <p>Classes</p>
        </div>
      </div>
      <div class="dashboard-item" @click="$router.push('/app/admin/resources')">
        <div class="icon-wrapper">
          <FolderIcon />
        </div>
        <div class="item-info">
          <h2>{{documentCounts.totalFolderCounts}}</h2>
          <p>Folders</p>
        </div>
      </div>
      <div class="dashboard-item">
        <div class="icon-wrapper">
          <FileIcon />
        </div>
        <div class="item-info">
          <h2>{{documentCounts.totalResourcesCounts}}</h2>
          <p>Resources</p>
        </div>
      </div>
    </div>

    <div class="users-sample">
      <h3>Users</h3>
      <div class="users" v-if="documentCounts.usersSample">
        <UserCard v-for="user in documentCounts.usersSample" :key="user._id" :userInfo="user" />
      </div>

      <div v-else>
        <p>No users</p>
      </div>
    </div>

    <div class="classes-sample">
      <h3>Classes</h3>
      <div class="classes" v-if="documentCounts.classSample">
        <ClassCard
          v-for="courseclass in documentCounts.classSample"
          :key="courseclass._id"
          :courseclass="courseclass"
          :showViewButton="false"
        />
      </div>

      <div v-else>
        <p>No classes</p>
      </div>
    </div>
  </div>
</template>

<script>
import FolderIcon from '~/static/Icons/folder.svg?inline'
import FileIcon from '~/static/Icons/file.svg?inline'
import UserIcon from '~/static/Icons/user.svg?inline'
import UsersIcon from '~/static/Icons/users.svg?inline'
import BookOpenIcon from '~/static/Icons/book-open.svg?inline'

import { mapGetters } from 'vuex'
import UserCard from '~/components/UserCard'
import ClassCard from '~/components/ClassCard'

export default {
  components: {
    FolderIcon,
    UserIcon,
    UsersIcon,
    FileIcon,
    BookOpenIcon,
    UserCard,
    ClassCard,
  },
  data() {
    return {
      documentCounts: {
        totalClassCounts: '',
        totalFolderCounts: '',
        totalResourcesCounts: '',
        totalUsersCounts: '',
        usersSample: null,
        classSample: null,
      },
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    async fetchAdminDashboardMetaInfo() {
      const res = await this.$store.dispatch('getAdminDashboardMetaInfo')
      this.documentCounts = {
        ...res.data.payload,
      }
    },
  },
  mounted() {
    this.fetchAdminDashboardMetaInfo()
  },
}
</script>

<style lang="scss" scoped>
#admin-dashboard {
  .dashboard-items {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 2rem;
    margin-top: 3rem;

    .dashboard-item {
      grid-column: span 3;
      padding: 1rem;
      display: flex;
      border-radius: 5px;
      background-color: var(--primary-background-color);
      transition: all 0.3s ease-in-out;
      @include normalBoxShadow;

      &:hover {
        @include hoverBoxShadow;

        .icon-wrapper {
          svg {
            stroke: var(--accent-background-color);
          }
        }
      }

      .icon-wrapper {
        background-color: var(--secondary-background-color);
        border-radius: 5px;
        padding: 8px 16px;
        max-width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          transition: all 0.3s ease-in-out;
        }
      }
      .item-info {
        margin-left: 1rem;
      }
    }
  }

  .users-sample {
    margin-top: 3rem;

    .users {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-auto-rows: 40px;
      grid-gap: 2rem;
      margin-top: 3rem;

      .user-card {
        margin-top: -2rem;
        grid-column: span 5;
        grid-row: span 3;
      }
    }
  }

  .classes-sample {
    margin-top: 2rem;

    .classes {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-gap: 2rem;
      margin-top: 1rem;
    }
  }
}
</style>