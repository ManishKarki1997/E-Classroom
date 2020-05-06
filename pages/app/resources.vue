<template>
  <div id="resources">
    <div class="shared-resources-menu">
      <div class="resource-wrapper">
        <h4>Class Resources</h4>
        <ul class="all-resources resources">
          <li
            v-for="classResource in allResources"
            :key="classResource.classId"
            :class="{selectedResource:selectedResource===classResource.classId}"
            @click="openFolderContents(classResource, false)"
          >
            <FolderIcon />
            <p>{{classResource.className}}</p>
          </li>

          <!-- <li
            @click="openFolderContents('Web Development')"
            :class="{selectedResource:selectedResource==='Web Development'}"
          >
            <FolderIcon />
            <p>Web Development</p>
          </li>-->
          <!-- <li
            @click="openFolderContents('Mobile App Development')"
            :class="{selectedResource:selectedResource==='Mobile App Development'}"
          >
            <FolderIcon />
            <p>Mobile App Development</p>
          </li>-->
        </ul>
      </div>

      <div class="resource-wrapper">
        <h4>Saved Resouces</h4>
        <ul class="all-resources resources">
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
      </div>
    </div>
    <div class="resource-files">
      <nuxt-child />
    </div>
  </div>
</template>

<script>
import FolderIcon from '~/static/Icons/folder.svg?inline'

export default {
  components: {
    FolderIcon
  },
  data() {
    return {
      selectedResource: '',
      allResources: [],
      savedResources: [],
      selectedResourceContents: {}
    }
  },
  methods: {
    async fetchAllResources(folderName) {
      this.selectedResource = folderName
      this.$router.push(`/app/resources/${folderName}`)
      const resources = await this.$store.dispatch('fetchUserClassResources')
      this.allResources = resources.data.resources
      this.savedResources = resources.data.savedResources
    },
    openFolderContents(classResource, savedResource) {
      // savedResource : user saved resource or class resource
      this.$store.commit('setSelectedResourceContents', classResource)
      savedResource
        ? this.$router.push(`/app/resources/${classResource.name}`)
        : this.$router.push(`/app/resources/${classResource.className}`)
      // console.log(classResource)
      // console.log(classId)
      // this.selectedResourceContents = this.allResources.filter(
      //   resource => classId === resource.classId
      // )
      // console.log(this.selectedResourceContents)
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