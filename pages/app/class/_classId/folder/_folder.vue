<template>
  <div id="folder-view-wrapper">
    <h3>{{ folderContent.folderName }}</h3>

    <div class="resource-files" v-if="folderContent.resources.length > 0">
      <div
        class="resource-file"
        v-for="file in folderContent.resources"
        :key="file._id"
      >
        <div class="resource-file--left">
          <div v-if="file.fileType === 'image'" class="image-file-wrapper">
            <img
              :src="apiUrl + '/uploads/resources/' + file.resourceUrl"
              alt="Resource File Image"
            />
          </div>
          <div class="icon-wrapper" v-else-if="file.fileType === 'office'">
            <PDFIcon />
          </div>
          <div class="icon-wrapper" v-else-if="file.fileType === 'zip'">
            <ZipIcon />
          </div>
        </div>
        <div class="resource-file--right">
          <div class="more-options-icon-wrapper">
            <MoreHorizontalIcon @click.prevent="openContextMenu(file)" />
          </div>
          <div @click="viewResourceFile(file)">
            <h3>{{ file.name }}</h3>
            <p class="uploaded-at">
              Uploaded on {{ file.createdAt | formatDate }}
            </p>
            <p class="file-size">{{ file.fileSize | convertFileSize }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="not-available" v-else>
      <p>No resources available</p>
    </div>

    <div v-if="showBookmarkResourceModal" class="modal-background-wrapper">
      <div class="modal-content-wrapper">
        <div class="modal-header">
          <h2>Bookmark Resource</h2>
          <CloseIcon @click="showBookmarkResourceModal = false" />
        </div>
        <div class="modal-body">
          <div class="add-folder-wrapper">
            <form @submit.prevent="bookmarkResource">
              <div class="form-input">
                <label for="resourceName">Resource Name</label>
                <input
                  type="text"
                  name="selectedFile"
                  id="selectedFile"
                  :value="selectedFile.name"
                  disabled
                />
              </div>

              <div class="form-input">
                <label for="folderName">Folder</label>
                <select
                  placeholder="Select a folder"
                  v-model="bookmarkPayload.folderId"
                  name="folderName"
                  id="folderName"
                >
                  <option
                    :value="folder._id"
                    v-for="folder in userBookmarkedFolders"
                    :key="folder._id"
                  >
                    {{ folder.folderName }}
                  </option>
                </select>
              </div>

              <div class="form-button">
                <button type="submit">Bookmark</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Context Menus -->
    <context-menu
      class="context-menu folder-option-context-menu"
      ref="folderOptionContextMenu"
    >
      <li @click="handleBookmarkClick">Bookmark</li>
      <li v-if="isUserOwned" @click="handleDeleteResource">Delete</li>
    </context-menu>

    <v-dialog />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import PlusIcon from '~/static/Icons/plus.svg?inline'
import ZipIcon from '~/static/Images/zip.svg?inline'
import PDFIcon from '~/static/Images/pdf.svg?inline'
import CloseIcon from '~/static/Icons/x-circle.svg?inline'
import MoreHorizontalIcon from '~/static/Icons/more-horizontal.svg?inline'
import contextMenu from 'vue-context-menu'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import dayjs from 'dayjs'

export default {
  components: {
    contextMenu,
    PlusIcon,
    MoreHorizontalIcon,
    CloseIcon,
    PDFIcon,
    ZipIcon,
  },
  data() {
    return {
      selectedFile: null,
      showBookmarkResourceModal: false,
      showDeleteResourceModal: false,
      bookmarkPayload: {
        folderId: '',
        resourceId: '',
        userId: '',
      },
    }
  },
  computed: {
    ...mapGetters([
      'apiUrl',
      'user',
      // 'userResourceFolders',
      'currentlyViewingClass',
      'folderContent',
    ]),
    ...mapState(['userBookmarkedFolders']),
    isUserOwned() {
      return this.user._id === this.currentlyViewingClass.createdBy._id
    },
  },

  methods: {
    bookmarkResource() {
      this.bookmarkPayload.resourceId = this.selectedFile._id
      if (this.bookmarkPayload.folderId === '') {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Please select a folder.',
          type: 'danger',
          dismissAfter: 3000,
        })
        return false
      }
      this.$store.dispatch('bookmarkResource', this.bookmarkPayload)
      setTimeout(() => {
        this.showBookmarkResourceModal = false
      }, 1500)
    },

    handleDeleteResource() {
      this.$modal.show('dialog', {
        title: 'Delete File',
        text: 'Are you sure you want to delete the file?',
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
              this.deleteResource()
            },
          },
        ],
      })
    },
    deleteResource() {
      this.$store.dispatch('deleteResourceFromFolder', {
        resourceId: this.selectedFile._id,
        folderId: this.$route.params.folder,
        userId: this.user._id,
      })
      this.$modal.hide('dialog')
    },
    handleBookmarkClick() {
      this.$store.dispatch('fetchUserResourceFolders')
      this.showBookmarkResourceModal = true
      // bookmarkResource
      //   this.$store.dispatch('bookmarkResourceToCollection', this.selectedFile._id)
    },
    viewResourceFile(resource) {
      window.open(
        `${this.apiUrl}/uploads/resources/${resource.resourceUrl}`,
        '_blank'
      )
    },
    openContextMenu(file) {
      this.selectedFile = file
      this.$refs.folderOptionContextMenu.open()
    },
    fetchUserResourceFolders() {
      this.$store.dispatch('fetchUserResourceFolders')
    },
    fetchFolderResources() {
      this.$store.dispatch('fetchFolderContents', this.$route.params.folder)
    },
  },
  filters: {
    convertFileSize(fileSize) {
      if (!fileSize || fileSize === '') return fileSize

      return Math.floor(fileSize / 1024 / 1024) === 0
        ? `${Math.floor(fileSize / 1024)} KB`
        : `${Math.floor(fileSize / 1024 / 1024)} MB`
    },
    formatDate(value) {
      return dayjs(value).format('MMMM DD, h:mm')
    },
  },
  mounted() {
    this.fetchFolderResources()
  },
}
</script>

<style lang="scss" scoped>
#folder-view-wrapper {
  padding: 1rem;

  .resource-files {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 2rem;

    .resource-file {
      grid-column: span 4;
      display: flex;
      border-radius: 5px;
      transition: all 0.3s ease-in-out;
      @include normalBoxShadow;

      &:hover {
        @include hoverBoxShadow;

        .resource-file--right .more-options-icon-wrapper {
          display: block;
        }
      }

      .resource-file--left {
        width: 40%;
        border-radius: 5px;
        overflow: hidden;
        .image-file-wrapper {
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
          }
        }

        .icon-wrapper {
          padding: 1rem;
          width: 50%;
          svg {
            width: 100%;
            height: 100%;
          }
        }
      }
      .resource-file--right {
        width: 60%;
        padding: 12px 8px;
        position: relative;
        margin-left: 1rem;

        p.uploaded-at {
          font-style: italic;
          font-size: 12px;
          margin-top: 4px;
          color: var(--secondary-font-color);
        }

        p.file-size {
          margin-top: 4px;
          font-weight: bold;
        }

        .more-options-icon-wrapper {
          position: absolute;
          right: 16px;
          top: 10px;
          display: none;

          svg {
            cursor: pointer;
          }
        }
      }
    }
  }
  .modal-body {
    .form-input {
      margin-bottom: 2rem;
    }
    .form-button {
      button {
        margin-top: 1rem;
        @include primaryButton;
        padding: 10px;
      }
    }
  }
}
</style>
