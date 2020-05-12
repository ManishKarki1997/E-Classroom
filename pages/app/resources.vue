<template>
  <div id="resources">
    <div class="shared-resources-menu">
      <div class="resource-wrapper">
        <h4>Class Resources</h4>
        <ul v-if="!isLoading" class="all-resources resources">
          <li
            v-for="classResource in allResources"
            :key="classResource.classId"
            :class="{selectedResource:selectedResource===classResource.classId}"
            @click="openFolderContents(classResource, false)"
          >
            <FolderIcon />
            <p>{{classResource.className}}</p>
          </li>
        </ul>
        <div v-else class="spinner-wrapper">
          <Spinner />
        </div>
      </div>

      <div class="resource-wrapper">
        <h4>Saved Resouces</h4>
        <ul v-if="!isLoading" class="all-resources resources">
          <li
            v-for="resource in savedResources"
            :key="resource._id"
            @click="openFolderContents(resource, true)"
            :class="{selectedResource:selectedResource===selectedResource}"
          >
            <FolderIcon />
            <p>{{resource.name}}</p>
          </li>
        </ul>
        <div v-else class="spinner-wrapper">
          <Spinner />
        </div>
      </div>
    </div>
    <div class="resource-files">
      <nuxt-child />
    </div>
  </div>
</template>

<script>
import FolderIcon from '~/static/Icons/folder.svg?inline'
import Spinner from '@/components/Spinner'

export default {
  components: {
    FolderIcon,
    Spinner
  },
  data() {
    return {
      selectedResource: '',
      allResources: [],
      savedResources: [],
      selectedResourceContents: {},
      isLoading: true
    }
  },
  methods: {
    async fetchAllResources(folderName) {
      this.selectedResource = folderName
      this.$router.push(`/app/resources/${folderName}`)
      const resources = await this.$store.dispatch('fetchUserClassResources')
      this.allResources = resources.data.resources
      this.savedResources = resources.data.savedResources
      this.isLoading = false
    },
    openFolderContents(classResource, savedResource) {
      // savedResource : user saved resource or class resource
      this.$store.commit('setSelectedResourceContents', classResource)
      savedResource
        ? this.$router.push(`/app/resources/${classResource.name}`)
        : this.$router.push(`/app/resources/${classResource.className}`)
    }
  },

  mounted() {
    this.fetchAllResources()
  }
}
</script>

<style lang="scss" scoped>
#resources {
  // padding: 14px 2rem;
  margin-left: 4rem;
  color: var(--primary-font-color);
  display: flex;
  width: 100%;
}

.shared-resources-menu {
  height: 100vh;
  background-color: var(
    --secondary-background-color
  ); //$secondary-background-light
  padding: 10px 16px;
  width: 20%;
}
.resource-files {
  width: 80%;
  height: 100%;
  padding: 10px 16px;
}
.resource-wrapper {
  margin-bottom: 2rem;
  width: 100%;
  min-height: 4rem;

  .spinner-wrapper {
    height: 4rem !important;
    width: 50%;
  }
}
.resources {
  margin-top: 16px;

  .selectedResource {
    p {
      color: #434c5e;
    }
    svg {
      fill: #434c5e;
    }
  }

  svg {
    width: 14px;
    height: 14px;
    fill: #858ea1;
  }

  li {
    display: flex;
    // align-items: center;
    cursor: pointer;
    margin-bottom: 8px;

    p {
      margin-left: 8px;
      font-size: 14px;
      color: #858ea1;
      margin-top: -5px;
      transition: all 0.3s ease-in-out;
    }
  }
}
</style>