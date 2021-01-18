<template>
  <div id="admin-resources-page">
    <h3>Resources</h3>

    <div class="class-resources-body">
      <div class="class-resources--left">
        <div class="not-available" v-if="allFolders && allFolders.length == 0">
          <p>No resources available</p>
        </div>
        <div class="class-resources-wrapper" v-else>
          <div class="class-resources">
            <div
              class="class-resource-folder"
              v-for="resourceFolder in allFolders"
              :key="resourceFolder._id"
            >
              <div class="more-options-icon-wrapper">
                <MoreHorizontalIcon @click="showContextMenu(resourceFolder)" />
              </div>
              <div class="resource-folder--left">
                <div class="resource-icon-wrapper">
                  <FolderIcon />
                </div>
              </div>
              <div class="resource-folder--right" @click="gotoFolderView(resourceFolder)">
                <h3>{{ resourceFolder.folderName }}</h3>
                <p>
                  <span>{{ resourceFolder.resources.length }}</span> files
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <context-menu class="add-button-context-menu" ref="resourceFolderContextMenu">
      <li @click="handleDeleteFolder">Delete</li>
    </context-menu>
  </div>
</template>

<script>
import contextMenu from 'vue-context-menu'

import MoreHorizontalIcon from '~/static/Icons/more-horizontal.svg?inline'
import FolderIcon from '~/static/Icons/folder.svg?inline'

export default {
  components: {
    contextMenu,
    MoreHorizontalIcon,
    FolderIcon,
  },
  data() {
    return {
      allFolders: [],
      currentlySelectedFolder: null,
    }
  },
  methods: {
    handleDeleteFolder() {
      this.$modal.show('dialog', {
        title: 'Delete Folder',
        text: 'Are you sure you want to delete the folder?',
        buttons: [
          {
            title: 'Cancel',
            handler: () => {
              this.$modal.hide('dialog')
            },
          },

          {
            title: 'Yes',
            handler: () => {
              this.deleteFolder()
            },
          },
        ],
      })
    },
    gotoFolderView(resourceFolder) {
      this.$store.commit('setFolderContent', resourceFolder)
      this.$router.push(`/app/admin/class/folder/${resourceFolder._id}`)
    },
    showContextMenu(resourceFolder) {
      this.currentlySelectedFolder = resourceFolder
      this.$refs.resourceFolderContextMenu.open()
    },
    async getAllClassFoldersForAdmin() {
      const res = await this.$store.dispatch('getAllClassFoldersForAdmin')
      this.allFolders = res.data.payload.allFolders
    },
  },
  mounted() {
    this.getAllClassFoldersForAdmin()
  },
}
</script>

<style lang="scss" scoped>
#admin-resources-page {
  .class-resources-body {
    .class-resources-wrapper {
      margin-top: 1rem;

      .class-resources {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        grid-gap: 2rem;

        .class-resource-folder {
          grid-column: span 4;
          display: flex;
          align-items: center;
          padding: 16px;
          border-radius: 5px;
          margin-bottom: 1rem;
          background-color: var(--primary-background-color);
          transition: all 0.3s ease-in-out;
          position: relative;
          @include normalBoxShadow;

          &:hover {
            @include hoverBoxShadow;

            .more-options-icon-wrapper {
              display: block;
            }
          }

          .resource-folder--left {
            margin-right: 1rem;

            .resource-icon-wrapper {
              padding: 1rem;
            }
          }
          .resource-folder--right {
            min-width: 90%;
            height: 100%;
            padding: 12px;
            p {
              margin-top: 2px;
            }
            p span {
              font-weight: bold;
              font-size: 16px;
            }
          }

          .more-options-icon-wrapper {
            position: absolute;
            right: 16px;
            top: 10px;
            display: none;
            z-index: 300;

            svg {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>