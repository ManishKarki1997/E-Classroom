<template>
  <div id="sidebar">
    <div class="user-account">
      <img src="~/static/Images/Saber.jpg" alt="Picture of the user" />
    </div>
    <div class="sidebar-menu">
      <ul>
        <li class="nav-link">
          <nuxt-link to="/get-started/login">
            <RocketIcon />
          </nuxt-link>
        </li>

        <li class="nav-link">
          <nuxt-link exact to="/app">
            <HomeIcon />
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/app/dashboard">
            <DashboardIcon />
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
      activeLink: ''
    }
  },
  methods: {
    toggleTheme() {
      if (this.themeMode === '') {
        document.body.setAttribute('theme', 'dark')
        this.themeMode = 'dark'
      } else {
        document.body.setAttribute('theme', '')
        this.themeMode = ''
      }
    }
  }
}
</script>
