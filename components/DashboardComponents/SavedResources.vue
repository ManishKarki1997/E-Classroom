<template>
  <div id="saved-resources">
    <div class="saved-resources">
      <h3 class="section-title">Saved Resources</h3>
      <div
        v-for="resource in savedResources.slice(0, 12)"
        :key="resource._id"
        class="saved-resource"
      >
        <p @click="gotoUrl(resource.resourceUrl)">
          {{ resource.name }}
          <span>{{ resource.classId.name }}</span>
        </p>
      </div>
      <p
        v-if="savedResources.length == 0"
        style="font-size:14px; margin-top:4px;"
      >
        No resource bookmarked yet.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      savedResources: []
    }
  },
  methods: {
    gotoUrl(url) {
      window.open(url, '_blank')
    },
    async fetchSavedResources() {
      const response = await this.$store.dispatch('fetchUserSavedResources')
      if (response.data.error) {
        this.$toast.open({
          type: 'error',
          message: 'Something went wrong while fetching your saved resources.',
          position: 'top-right',
          duration: 1500
        })
        return false
      }

      this.savedResources = response.data.payload.savedResources
    }
  },
  mounted() {
    this.fetchSavedResources()
  }
}
</script>

<style lang="scss" scoped>
#saved-resources {
  background-color: var(--secondary-background-color);
}
.saved-resources {
  h4 {
    margin-bottom: 8px;
  }
}
.saved-resource {
  p {
    font-size: 12px;
    cursor: pointer;
    text-transform: capitalize;

    span {
      font-style: italic;
      font-size: 10px;
      margin-left: 8px;
    }

    &:hover {
      filter: opacity(0.8);
    }
  }
}
</style>
