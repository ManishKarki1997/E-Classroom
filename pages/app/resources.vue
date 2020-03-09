<template>
  <div id="resources">
    <div class="shared-resources-menu">
      <div class="resource-wrapper">
        <h4>Class Resources</h4>
        <ul class="all-resources resources">
          <li
            @click="openFolderContents('Web Development')"
            :class="{selectedResource:selectedResource==='Web Development'}"
          >
            <FolderIcon />
            <p>Web Development</p>
          </li>
          <li
            @click="openFolderContents('Mobile App Development')"
            :class="{selectedResource:selectedResource==='Mobile App Development'}"
          >
            <FolderIcon />
            <p>Mobile App Development</p>
          </li>
        </ul>
      </div>

      <div class="resource-wrapper">
        <h4>Starred</h4>
        <ul class="all-resources resources">
          <li
            @click="openFolderContents('Project Resources')"
            :class="{selectedResource:selectedResource==='Project Resources'}"
          >
            <FolderIcon />
            <p>Project Resources</p>
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
      selectedResource: ''
    }
  },
  methods: {
    openFolderContents(folderName) {
      this.selectedResource = folderName
      this.$router.push(`/app/resources/${folderName}`)
    }
  }
}
</script>

<style lang="scss" scoped>
#resources {
  // padding: 14px 2rem;
  margin-left: 4rem;
  color: black;
  display: flex;
  width: 100%;
}
.shared-resources-menu {
  height: 100vh;
  background-color: white; //$secondary-background-light
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
      color: black;
    }
    svg {
      fill: black;
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