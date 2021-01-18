<template>
  <div id="sidebar">
    <div class="sidebar-user-account" v-if="user">
      <div class="user-avatar-wrapper">
        <img
          @click="$router.push('/app/profile')"
          :src="apiUrl + '/uploads/images/' + user.avatar"
          alt
        />
      </div>
      <div>
        <h3>{{ user.name }}</h3>
        <p
          style="margin-top:-4px; font-size:14px; font-style:italic;"
        >{{user.userType.toLowerCase()}}</p>
      </div>
    </div>
    <ul class="nav-wrapper">
      <li>
        <nuxt-link to="/app/dashboard">
          <div class="nav-icon-wrapper">
            <HomeIcon />
          </div>
          <p>Dashboard</p>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link :to="isAdmin ? '/app/admin/classes' : '/app/classes'">
          <div class="nav-icon-wrapper">
            <BookOpenIcon />
          </div>
          <p>Classes</p>
        </nuxt-link>
      </li>
      <li v-if="!isAdmin && !isTeacher">
        <nuxt-link to="/app/assignments?sortBy=dueDate">
          <div class="nav-icon-wrapper">
            <ClipboardIcon />
          </div>
          <p>Assignments</p>
        </nuxt-link>
      </li>
      <li v-if="isAdmin">
        <nuxt-link to="/app/admin/users">
          <div class="nav-icon-wrapper">
            <UsersIcon />
          </div>
          <p>Users</p>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link :to="isAdmin ? '/app/admin/resources' : '/app/resources'">
          <div class="nav-icon-wrapper">
            <FolderIcon />
          </div>
          <p>Resources</p>
        </nuxt-link>
      </li>
      <!-- <li>
        <nuxt-link to="/app/settings">
          <div class="nav-icon-wrapper">
            <SettingsIcon />
          </div>
          <p>Settings</p>
        </nuxt-link>
      </li>-->
      <li @click="toggleTheme">
        <nuxt-link to>
          <div class="nav-icon-wrapper">
            <MoonIcon />
          </div>
          <p>{{preferredColorScheme==='light' ? 'Dark' : 'Light'}}</p>
        </nuxt-link>
      </li>
      <li @click="logout">
        <nuxt-link to>
          <div class="nav-icon-wrapper">
            <LogoutIcon />
          </div>
          <p>Logout</p>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HomeIcon from '~/static/Icons/home.svg?inline'
import SettingsIcon from '~/static/Icons/settings.svg?inline'
import FolderIcon from '~/static/Icons/folder.svg?inline'
import UsersIcon from '~/static/Icons/users.svg?inline'
import LogoutIcon from '~/static/Icons/log-out.svg?inline'
import SunIcon from '~/static/Icons/sun.svg?inline'
import MoonIcon from '~/static/Icons/moon.svg?inline'
import BookOpenIcon from '~/static/Icons/book-open.svg?inline'
import ClipboardIcon from '~/static/Icons/clipboard.svg?inline'

export default {
  components: {
    HomeIcon,
    SettingsIcon,
    FolderIcon,
    LogoutIcon,
    SunIcon,
    MoonIcon,
    BookOpenIcon,
    ClipboardIcon,
    UsersIcon,
  },
  computed: {
    ...mapGetters(['apiUrl', 'isAdmin', 'user', 'preferredColorScheme']),
    isTeacher() {
      return this.user && this.user.userType == 'TEACHER'
    },
  },
  methods: {
    toggleTheme() {
      this.$store.commit(
        'setPreferredColorScheme',
        this.preferredColorScheme === 'light' ? 'dark' : 'light'
      )
    },
    logout() {
      this.$store.dispatch('logout')
    },
  },
}
</script>

<style lang="scss" scoped>
#sidebar {
  max-width: 15rem;
  width: 5rem;
  height: 100vh;
  padding: 1rem 0;
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  @include normalBoxShadow;

  // background-color: var(--secondary-background-color);

  background-color: var(--sidebar-background-color);
  background: linear-gradient(
    97deg,
    var(--sidebar-background-color) 40%,
    var(--sidebar-background-color) 70%,
    var(--sidebar-background-color) 100%
  );

  transition: all 0.3s ease-in-out;

  &:hover {
    width: 100%;
    transition: all 0.3s ease-in-out;
    @include hoverBoxShadow;

    ul.nav-wrapper li {
      svg {
        margin-right: 1rem;
        transition: all 0.3s ease-in-out;
      }
    }
  }

  .sidebar-user-account {
    width: 100%;
    height: 4rem;
    display: flex;
    overflow-x: hidden;
    padding: 0 1.5rem;
    .user-avatar-wrapper {
      margin-right: 1rem;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
    h3 {
      font-size: 18px;
    }
  }

  ul.nav-wrapper {
    margin-top: 6rem;
    display: flex;
    flex-direction: column;
    height: 80%;
    li {
      margin-bottom: 1rem;
      overflow-x: hidden;
      // color: var(--primary-font-color);

      transition: all 0.3s ease-in-out;
      padding: 8px 0;

      svg {
        // stroke: #d6eaff;
        stroke: var(--opposite-font-color);
      }

      &:hover {
        background-color: var(--accent-background-color);

        p {
          color: var(--opposite-font-color);
        }
        svg {
          stroke: var(--opposite-font-color);
        }
      }

      &:last-child {
        margin-top: auto;
      }

      a {
        display: flex;
        align-items: center;
        padding: 8px 1.7rem;
      }
      .nav-icon-wrapper {
        width: 24px;
        height: 24px;
        margin-right: 2rem;
      }
    }
  }
}
</style>
