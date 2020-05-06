<template>
  <div id="settings">
    <h3>Settings</h3>
    <div class="settings">
      <div class="setting">
        <p>Interactive Tour</p>
        <select
          v-model="skipTourNextTime"
          @change="toggleSkipTour"
          name="interactive_tour"
          id="interactive_tour"
        >
          <option value="true">Enabled</option>
          <option value="false">Disabled</option>
        </select>
      </div>
      <div class="setting">
        <p>Preferred Color Scheme</p>
        <select
          v-model="preferredColorScheme"
          @change="setPreferredColorScheme"
          name="color_scheme"
          id="color_scheme"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      skipTourNextTime: this.$store.state.skipTourNextTime,
      preferredColorScheme: this.$store.state.preferredColorScheme
    }
  },
  methods: {
    toggleSkipTour() {
      // commit the changes to the store
      this.$store.commit('setSkipTourNextTime', this.skipTourNextTime)
    },
    setPreferredColorScheme() {
      // commit the theme preference to the store
      this.$store.commit('setPreferredColorScheme', this.preferredColorScheme)

      // save the preference in local storage
      localStorage.setItem(
        'eclasses-theme',
        JSON.stringify(this.preferredColorScheme)
      )

      document.body.setAttribute('theme', this.preferredColorScheme)
    }
  }
}
</script>

<style lang="scss" scoped>
#settings {
  padding: 14px 2rem;
  width: 100%;
  height: 100%;
}
.settings {
  margin-top: 1rem;
  width: 35%;
}
.setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;

  select {
    padding: 4px 8px;
    border-radius: 4px;
  }
}
</style>