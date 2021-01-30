<template>
  <div id="user-all-resources-page">
    <div
      class="user-bookmarked-resources-wrapper"
      v-if="
        userPersonalResources.userResourceFolders &&
        userPersonalResources.userResourceFolders.length > 0
      "
    >
      <h4>Bookmarked Resources</h4>

      <div class="class-resources-wrapper">
        <transition-group
          class="class-resources"
          tag="div"
          name="slide-fade"
          v-if="
            userPersonalResources.userResourceFolders !== undefined &&
            userPersonalResources.userResourceFolders.length > 0
          "
        >
          <div
            class="class-resource-folder"
            v-for="resourceFolder in userPersonalResources.userResourceFolders"
            :key="resourceFolder._id"
          >
            <div class="more-options-icon-wrapper">
              <MoreHorizontalIcon
                @click="showContextMenu(resourceFolder, true)"
              />
            </div>
            <div
              class="resource-folder--left"
              @click="viewUserResourceFolder(resourceFolder)"
            >
              <div class="resource-icon-wrapper">
                <FolderIcon />
              </div>
            </div>
            <div
              class="resource-folder--right"
              @click="viewUserResourceFolder(resourceFolder)"
            >
              <h3>{{ resourceFolder.folderName }}</h3>
              <p>
                <span>{{ resourceFolder.resources.length }}</span>
                file{{ resourceFolder.resources.length == 0 ? '' : 's' }}
              </p>
            </div>
          </div>
        </transition-group>

        <div v-else class="not-available">
          <p>No resources available</p>
        </div>
      </div>
    </div>

    <div
      class="user-classes-resources-wrapper"
      v-if="
        userPersonalResources.resourceFolders &&
        userPersonalResources.resourceFolders.length > 0
      "
    >
      <h4>All Class Resources</h4>
      <transition-group
        class="class-resources"
        tag="div"
        name="slide-fade"
        v-if="
          userPersonalResources.resourceFolders &&
          userPersonalResources.resourceFolders.length > 0
        "
      >
        <div
          class="class-resource"
          v-for="classResource in userPersonalResources.resourceFolders"
          :key="classResource.classId"
          @click="viewClassResourceFolders(classResource)"
        >
          <!-- <div class="more-options-icon-wrapper">
            <MoreHorizontalIcon @click="showContextMenu(classResource, false)" />
          </div>-->
          <div class="class-background-image-wrapper">
            <img
              :src="
                apiUrl + '/uploads/images/' + classResource.classBackgroundImage
              "
              alt="Class background image wrapper"
            />
          </div>
          <div class="class-resource-details">
            <h4>{{ classResource.className }}</h4>
            <p class="subtitle">
              <strong>{{ classResource.resourceFolders.length }}</strong>
              folder{{ classResource.resourceFolders.length == 0 ? '' : 's' }}
            </p>
          </div>
        </div>
      </transition-group>

      <div v-else class="not-available">
        <p>No resources available</p>
      </div>
    </div>

    <Modal v-if="showRenameFolderModal" @closeModal="closeModal">
      <template slot="header">Rename Folder</template>
      <template slot="body">
        <form @submit.prevent="renameFolder">
          <div class="form-input">
            <label for="oldFolderName">Old Folder Name</label>
            <h4>{{ selectedFolder.folderName }}</h4>
          </div>
          <div class="form-input">
            <label for="newFolderName">New Folder Name</label>
            <input
              type="text"
              name="newFolderName"
              id="newFolderName"
              v-model="newFolderName"
            />
          </div>
        </form>
      </template>

      <template slot="footer">
        <button type="submit" @click="renameFolder">Rename</button>
        <button @click="showRenameFolder = false">Cancel</button>
      </template>
    </Modal>

    <context-menu class="context-menu" ref="userResourcesFolderContextMenu">
      <li v-if="!userResourceFolderSelected" @click="copyFolder">Copy</li>
      <li v-if="userResourceFolderSelected" @click="handleRenameFolder">
        Rename
      </li>
      <li v-if="userResourceFolderSelected" @click="handleDeleteFolder">
        Delete
      </li>
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
import contextMenu from 'vue-context-menu'
import Modal from '~/components/Modal'

export default {
  components: {
    contextMenu,
    ADD_TOAST_MESSAGE,
    Modal,
    PlusIcon,
    MoreHorizontalIcon,
    FolderIcon,
  },
  data() {
    return {
      bookmarkedResources: [],
      selectedFolder: null,
      userResourceFolderSelected: false,
      showRenameFolderModal: false,
      newFolderName: '',
    }
  },
  computed: {
    ...mapGetters(['user', 'apiUrl', 'userPersonalResources']),
  },
  methods: {
    viewUserResourceFolder(resourceFolder) {
      this.$store.commit('setFolderContent', resourceFolder)
      this.$router.push(`/app/resources/view/${resourceFolder._id}`)
    },
    viewClassResourceFolders(classResource) {
      this.$store.commit(
        'setCurrentClassResourceFolders',
        classResource.resourceFolders
      )
      // this.$router.push(`/app/resources/${classResource.classId}`)
      this.$router.push(`/app/resources/class/${classResource.classId}`)
    },
    showContextMenu(resourceFolder, isUserResource) {
      this.selectedFolder = resourceFolder
      this.userResourceFolderSelected = isUserResource
      this.$refs.userResourcesFolderContextMenu.open()
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
        folderId: this.selectedFolder._id,
        newFolderName: this.newFolderName,
      }

      this.$store.dispatch('renameResourceFolder', renamePayload)

      const updatedBookmaredResourceFolders = this.userPersonalResources.userResourceFolders.map(
        (folder) =>
          folder._id === this.selectedFolder._id
            ? { ...this.selectedFolder, folderName: this.newFolderName }
            : this.selectedFolder
      )
      this.$store.commit('setUserPersonalResources', {
        userResourceFolders: updatedBookmaredResourceFolders,
        resourceFolders: this.userPersonalResources.resourceFolders,
      })

      setTimeout(() => {
        this.showRenameFolderModal = false
      }, 1000)
    },
    handleRenameFolder() {
      this.showRenameFolderModal = true
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
    deleteFolder() {
      this.$store.dispatch('deleteResourceFolder', this.selectedFolder._id)
      this.$modal.hide('dialog')
      this.$forceUpdate()
    },
    closeModal() {
      this.showRenameFolderModal = false
    },
    copyFolder() {
      // this.$modal.hide('copyDialog')
      this.$store.dispatch('copyFolder', {
        userId: this.user._id,
        folderId: this.selectedFolder._id,
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
    gotoFolderView(resourceFolder) {},
    fetchAllResources() {
      this.$store.dispatch('fetchAllResources')
    },
  },
  mounted() {
    this.fetchAllResources()
  },
}
</script>

<style lang="scss" scoped>
#user-all-resources-page {
  .user-bookmarked-resources-wrapper {
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
          padding: 8px;
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
  .user-classes-resources-wrapper {
    margin-top: 2rem;
    .class-resources {
      margin-top: 1rem;
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-gap: 2rem;

      .class-resource {
        grid-column: span 3;
        background-color: var(--primary-background-color);
        cursor: pointer;
        @include normalBoxShadow;
        transition: all 0.3s ease-in-out;
        border-radius: 5px;
        overflow: hidden;
        position: relative;

        &:hover {
          @include hoverBoxShadow;
        }

        .more-options-icon-wrapper {
          position: absolute;
          right: 12px;
          top: 6px;

          svg {
            stroke: var(--opposite-font-color);
          }
        }

        .class-background-image-wrapper {
          img {
            width: 100%;
            height: 100%;
          }
        }

        .class-resource-details {
          padding: 1rem 8px;
          .subtitle {
            margin-top: 8px;
          }
        }
      }
    }
  }
}
</style>
