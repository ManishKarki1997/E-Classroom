<template>
  <header>
    <h1>
      <nuxt-link to="/">
        Virtual
        <span>Classroom</span>
      </nuxt-link>
    </h1>
    <ul>
      <li>
        <nuxt-link to="/login">Login</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/register">Register</nuxt-link>
      </li>
      <li @click="toggleTheme">
        <SunIcon v-if="preferredColorScheme === 'dark'" />
        <MoonIcon v-if="preferredColorScheme === 'light'" />
      </li>
    </ul>
  </header>
</template>

<script>
import { mapState } from 'vuex'
import SunIcon from '~/static/Icons/sun.svg?inline'
import MoonIcon from '~/static/Icons/moon.svg?inline'

export default {
  components: {
    SunIcon,
    MoonIcon,
  },
  computed: {
    ...mapState(['preferredColorScheme']),
  },
  methods: {
    toggleTheme() {
      this.$store.commit(
        'setPreferredColorScheme',
        this.preferredColorScheme === 'light' ? 'dark' : 'light'
      )
    },
  },
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4rem;
  height: 6rem;

  h1 {
    font-weight: bold;
    font-size: 1.5rem;
    span {
      color: var(--accent-background-color);
    }
  }

  ul {
    display: flex;
    align-items: center;

    li {
      margin-left: 1rem;
      cursor: pointer;

      &:nth-child(2) {
        background-color: var(--accent-background-color);
        padding: 8px 16px;
        border-radius: 5px;
        transition: all 0.3s ease-in-out;

        &:hover {
          background-color: #1b69b3;
        }
        a {
          color: var(--opposite-font-color);
        }
      }
    }
  }
}
</style>
