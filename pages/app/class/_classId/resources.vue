<template>
  <div id="class-resources-wrapper">
    <div class="class-resources-header">
      <h2>Resources</h2>
      <div v-if="isUserOwned" class="action-buttons">
        <button @click.prevent="$refs.addButtonContextMenu.open">
          <div class="icon-wrapper">
            <PlusIcon />
          </div>Add
        </button>
      </div>
    </div>
    <div class="class-resources-body">
      <div class="class-resources--left">
        <div class="not-available" v-if="currentClassResourceFolders.length == 0">
          <p>No resources available</p>
        </div>
        <div class="class-resources-wrapper" v-else>
          <div class="class-resources">
            <div
              class="class-resource-folder"
              v-for="resourceFolder in currentClassResourceFolders"
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

    <!-- Modals -->
    <AddResourceFolderModal
      v-if="showAddResourceFolderModal"
      @createFolder="createFolder"
      @switchAddModal="switchAddModal"
      @closeAddResourceFolderModal="closeAddResourceFolderModal"
    />

    <AddResourceModal
      v-if="showAddResourceModal"
      @switchAddModal="switchAddModal"
      @closeAddResourceModal="closeAddResourceModal"
      @addNewResource="addNewResource"
    />

    <Modal v-if="showRenameFolderModal" @closeModal="closeModal">
      <template slot="header">Rename Folder</template>
      <template slot="body">
        <form @submit.prevent="renameFolder">
          <div class="form-input">
            <label for="oldFolderName">Old Folder Name</label>
            <h4>{{ currentlySelectedFolder.folderName }}</h4>
          </div>
          <div class="form-input">
            <label for="newFolderName">New Folder Name</label>
            <input type="text" name="newFolderName" id="newFolderName" v-model="newFolderName" />
          </div>
        </form>
      </template>

      <template slot="footer">
        <button type="submit" @click="renameFolder">Rename</button>
        <button @click="showRenameFolder = false">Cancel</button>
      </template>
    </Modal>

    <!-- Context Menus -->
    <context-menu v-if="isUserOwned" class="add-button-context-menu" ref="addButtonContextMenu">
      <li @click="showAddResource">Resource</li>
      <li @click="showAddResourceFolder">Folder</li>
    </context-menu>

    <context-menu class="add-button-context-menu" ref="resourceFolderContextMenu">
      <li v-if="!isUserOwned" @click="copyFolder">Copy</li>
      <li v-if="isUserOwned" @click="handleRenameFolder">Rename</li>
      <li v-if="isUserOwned" @click="handleDeleteFolder">Delete</li>
    </context-menu>
    <v-dialog />
    <v-dialog name="copyDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FolderIcon from '~/static/Icons/folder.svg?inline'
import PlusIcon from '~/static/Icons/plus.svg?inline'
import MoreHorizontalIcon from '~/static/Icons/more-horizontal.svg?inline'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

import Modal from '~/components/Modal'
import contextMenu from 'vue-context-menu'
import AddResourceFolderModal from '~/components/AddResourceFolderModal'
import AddResourceModal from '~/components/AddResourceModal'

export default {
  components: {
    contextMenu,
    FolderIcon,
    MoreHorizontalIcon,
    PlusIcon,
    AddResourceFolderModal,
    AddResourceModal,
    Modal,
  },
  data() {
    return {
      showAddResourceFolderModal: false,
      showAddResourceModal: false,
      showRenameFolderModal: false,
      newFolderName: '',
      currentlySelectedFolder: null,
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'currentlyViewingClass',
      'currentClassResourceFolders',
    ]),
    isUserOwned() {
      return this.user._id === this.currentlyViewingClass.createdBy._id
    },
  },
  methods: {
    gotoFolderView(resourceFolder) {
      this.$store.commit('setFolderContent', resourceFolder)
      this.$router.push(
        `/app/class/${this.currentlyViewingClass._id}/folder/${resourceFolder._id}`
      )
    },
    renameFolder() {
      if (this.newFolderName === '') {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Please provide a non-empty folder name',
          type: 'danger',
          dismissAfter: 3000,
        })
        return false
      }
      const renamePayload = {
        userId: this.user._id,
        folderId: this.currentlySelectedFolder._id,
        newFolderName: this.newFolderName,
      }
      this.$store.dispatch('renameResourceFolder', renamePayload)
      setTimeout(() => {
        this.showRenameFolderModal = false
      }, 1000)
    },
    handleRenameFolder() {
      this.showRenameFolderModal = true
    },
    deleteFolder() {
      this.$store.dispatch(
        'deleteResourceFolder',
        this.currentlySelectedFolder._id
      )
      this.$modal.hide('dialog')
    },
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
    copyFolder() {
      // this.$modal.hide('copyDialog')
      this.$store.dispatch('copyFolder', {
        userId: this.user._id,
        folderId: this.currentlySelectedFolder._id,
      })
    },
    handleCopyFolder() {
      this.$modal.show('copyDialog', {
        title: 'Copy Folder',
        text: 'Are you sure you want to copy the folder?',
        buttons: [
          {
            title: 'Cancel',
            handler: () => {
              this.$modal.hide('copyDialog')
            },
          },

          {
            title: 'Yes',
            handler: () => {
              this.copyFolder()
            },
          },
        ],
      })
    },
    showAddResource() {
      this.showAddResourceModal = true
    },
    showAddResourceFolder() {
      this.showAddResourceFolderModal = true
    },
    switchAddModal() {
      this.showAddResourceFolderModal = !this.showAddResourceFolderModal
      this.showAddResourceModal = !this.showAddResourceModal
    },
    createFolder(newFolder) {
      this.$store.dispatch('addNewResourceFolder', newFolder)
      this.showAddResourceFolderModal = false
    },
    addNewResource(newResource) {
      this.$store.dispatch('addNewResourceDirectlyToFolder', newResource)
      this.showAddResourceModal = false
    },
    closeAddResourceFolderModal() {
      this.showAddResourceFolderModal = false
    },
    closeAddResourceModal() {
      this.showAddResourceModal = false
    },
    showContextMenu(resourceFolder) {
      this.currentlySelectedFolder = resourceFolder
      this.$refs.resourceFolderContextMenu.open()
    },
    closeModal() {
      this.showRenameFolderModal = false
    },
    fetchClassFolderResources() {
      this.$store.dispatch(
        'fetchClassFolderResources',
        this.currentlyViewingClass._id
      )
    },
  },
  mounted() {
    this.fetchClassFolderResources()
  },
}
</script>

<style lang="scss" scoped>
#class-resources-wrapper {
  padding: 1rem;

  .class-resources-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .action-buttons {
      button {
        display: flex;
        align-items: center;
        svg {
          margin-right: 8px;
          margin-top: 4px;
        }
        @include primaryButton;
        padding: 4px 32px;
        transition: all 0.3s ease-in-out;
        &:hover {
          background-color: var(--button-background-hover);
        }
      }
      // button {
      //   &:first-child {
      //     @include secondaryButton(true, true);
      //     padding: 6px 20px;
      //     font-size: 14px;
      //     transition: all 0.3s ease-in-out;
      //     &:hover {
      //       background-color: var(--button-background-color);
      //       color: var(--opposite-font-color);
      //     }

      //     svg {
      //       width: 20px;
      //       height: 20px;
      //       margin-top: 4px;
      //     }
      //   }
      // }
    }
  }
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
            min-width: 80%;
            // height: 100%;
            // padding: 12px;
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

  .add-button-context-menu {
    padding: 0;
    li {
      padding: 6px 10px;
      cursor: pointer;
      &:hover {
        background-color: var(--button-background-color);
        color: var(--opposite-font-color);
      }
    }
  }
}
</style>
