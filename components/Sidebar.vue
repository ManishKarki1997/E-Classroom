<template>
  <div id="sidebar">
    <div class="user-account">
      <img
        @click="$router.push('/app/profile/info')"
        :src="apiStaticUrl + '/uploads/images/' + user.avatar"
        alt
      />
      <h3>{{ user.name }}</h3>
      <!-- <img src="~/static/Images/Saber.jpg" alt="Picture of the user" /> -->
    </div>
    <!-- <div class="sidebar-menu"> -->
    <ul class="sidebar-menu">
      <li class="nav-link" v-if="!user">
        <nuxt-link to="/get-started/login">
          <RocketIcon />
          <p>Login</p>
        </nuxt-link>
      </li>

      <li class="nav-link">
        <nuxt-link exact to="/app/dashboard">
          <DashboardIcon />
          <p>Dashboard</p>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link to="/app/classes">
          <HomeIcon />
          <p>Home</p>
        </nuxt-link>
      </li>
      <li class="my-classes">
        <nuxt-link to="/app/classes">
          <HomeIcon />
          <p>Classes</p>
        </nuxt-link>

        <div class="my-class-sub-menu">
          <nuxt-link to="/app/profile/enrolled">
            Enrolled
          </nuxt-link>
          <nuxt-link to="/app/profile/teaching">
            Teaching
          </nuxt-link>
        </div>
      </li>
      <!-- <li>
          <nuxt-link to="/app/classroom">
            <StudyIcon />
          </nuxt-link>
        </li>-->
      <li>
        <nuxt-link to="/app/resources">
          <ResourcesIcon />
          <p>Resources</p>
        </nuxt-link>
      </li>
      <li class="settings-menu">
        <nuxt-link to="/app/settings">
          <SettingsIcon />
          <p>Settings</p>
        </nuxt-link>
      </li>
      <li class="theme-toggle-menu" @click="toggleTheme">
        <SunIcon v-if="themeMode === 'dark'" />
        <MoonIcon v-if="themeMode === ''" />
      </li>
      <li style="margin-left:2px;" @click="logout">
        <LogoutIcon />
      </li>
    </ul>
    <!-- </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

import HomeIcon from '~/static/Icons/home.svg?inline'
import ResourcesIcon from '~/static/Icons/paper.svg?inline'
import StudyIcon from '~/static/Icons/book.svg?inline'
import DashboardIcon from '~/static/Icons/dashboard.svg?inline'
import SettingsIcon from '~/static/Icons/settings.svg?inline'
import SunIcon from '~/static/Icons/sun.svg?inline'
import MoonIcon from '~/static/Icons/moon.svg?inline'
import RocketIcon from '~/static/Icons/start.svg?inline'
import LogoutIcon from '~/static/Icons/logout.svg?inline'

export default {
  components: {
    HomeIcon,
    ResourcesIcon,
    StudyIcon,
    DashboardIcon,
    SettingsIcon,
    SunIcon,
    MoonIcon,
    RocketIcon,
    LogoutIcon
  },
  data() {
    return {
      themeMode: '',
      activeLink: '',
      apiStaticUrl: ''
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    toggleTheme() {
      if (this.themeMode === '') {
        document.body.setAttribute('theme', 'dark')
        this.themeMode = 'dark'
        this.setTheme('dark')
      } else {
        document.body.setAttribute('theme', '')
        this.themeMode = ''
        this.setTheme('light')
      }
    },
    setTheme(themeMode) {
      localStorage.setItem(
        'eclasses-theme',
        JSON.stringify(this.themeMode || themeMode)
      )
      this.$store.commit('setPreferredColorScheme', themeMode)
    },
    logout() {
      this.$store.commit('logout')
      this.$router.push('/get-started/login')
    }
  },
  mounted() {
    // const savedTheme = JSON.parse(localStorage.getItem('eclasses-theme'))
    const savedTheme = this.$store.state.preferredColorScheme
    // If the saved theme in local storage is 'dark', set themeMode to '' i.e. light because toggleTheme works in reverse
    // and if saved theme is '' i.e. light, set themeMode to dark;
    this.$store.commit('setPreferredColorScheme', savedTheme)
    savedTheme === 'dark' ? (this.themeMode = '') : (this.themeMode = 'dark')
    this.toggleTheme()
    this.apiStaticUrl = process.env.baseUrl
  }
}
</script>
