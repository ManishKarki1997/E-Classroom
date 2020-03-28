<template>
  <div id="sidebar">
    <div class="user-account">
      <img :src="apiStaticUrl + '/uploads/images/' + user.avatar" alt />
      <!-- <img src="~/static/Images/Saber.jpg" alt="Picture of the user" /> -->
    </div>
    <div class="sidebar-menu">
      <ul>
        <li class="nav-link">
          <nuxt-link to="/get-started/login">
            <RocketIcon />
          </nuxt-link>
        </li>

        <li class="nav-link">
          <nuxt-link exact to="/app/dashboard">
            <DashboardIcon />
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/app/classes">
            <HomeIcon />
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/app/classroom">
            <StudyIcon />
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/app/resources">
            <ResourcesIcon />
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/app/settings">
            <SettingsIcon />
          </nuxt-link>
        </li>
        <li @click="toggleTheme">
          <SunIcon v-if="themeMode==='dark'" />
          <MoonIcon v-if="themeMode===''" />
        </li>
      </ul>
    </div>
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

export default {
  components: {
    HomeIcon,
    ResourcesIcon,
    StudyIcon,
    DashboardIcon,
    SettingsIcon,
    SunIcon,
    MoonIcon,
    RocketIcon
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
        this.setTheme()
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
    }
  },
  mounted() {
    const savedTheme = JSON.parse(localStorage.getItem('eclasses-theme'))
    // If the saved theme in local storage is 'dark', set themeMode to '' i.e. light because toggleTheme works in reverse
    // and if saved theme is '' i.e. light, set themeMode to dark;
    savedTheme === 'dark' ? (this.themeMode = '') : (this.themeMode = 'dark')
    this.toggleTheme()
    this.apiStaticUrl = process.env.baseUrl
  }
}
</script>
