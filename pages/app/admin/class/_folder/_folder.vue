<template>
  <div id="admin-view-folder-page">
    <h3>{{ folderContent.folderName }}</h3>

    <div class="resource-files" v-if="folderContent.resources.length > 0">
      <div
        class="resource-file"
        v-for="file in folderContent.resources"
        :key="file._id"
      >
        <div class="resource-file--left">
          <div
            @click="viewResourceFile(file)"
            v-if="file.fileType === 'image'"
            class="image-file-wrapper"
          >
            <img
              :src="apiUrl + '/uploads/resources/' + file.resourceUrl"
              alt="Resource File Image"
            />
          </div>
          <div
            @click="viewResourceFile(file)"
            class="icon-wrapper"
            v-else-if="file.fileType === 'office'"
          >
            <PDFIcon />
          </div>
          <div
            @click="viewResourceFile(file)"
            class="icon-wrapper"
            v-else-if="file.fileType === 'zip'"
          >
            <ZipIcon />
          </div>
        </div>
        <div class="resource-file--right">
          <div class="more-options-icon-wrapper">
            <MoreHorizontalIcon @click.prevent="openContextMenu(file)" />
          </div>
          <div @click="viewResourceFile(file)">
            <h4>{{ file.name }}</h4>
            <p class="uploaded-at">
              Uploaded on {{ file.createdAt | formatDate }}
            </p>
            <p class="file-size">{{ file.fileSize | convertFileSize }}</p>
          </div>
        </div>
      </div>
    </div>

    <context-menu
      class="context-menu folder-option-context-menu"
      ref="folderOptionContextMenu"
    >
      <li @click="handleDeleteResource">Delete</li>
    </context-menu>

    <v-dialog />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import contextMenu from 'vue-context-menu'

import ZipIcon from '~/static/Images/zip.svg?inline'
import PDFIcon from '~/static/Images/pdf.svg?inline'
import MoreHorizontalIcon from '~/static/Icons/more-horizontal.svg?inline'

export default {
  components: {
    ZipIcon,
    PDFIcon,
    MoreHorizontalIcon,
    contextMenu,
  },
  data() {
    return {
      selectedFile: null,
    }
  },
  computed: {
    ...mapGetters([
      'apiUrl',
      'user',
      'userResourceFolders',
      'currentlyViewingClass',
      'folderContent',
    ]),
  },
  methods: {
    openContextMenu(file) {
      this.selectedFile = file
      this.$refs.folderOptionContextMenu.open()
    },
    viewResourceFile(resource) {
      window.open(
        `${this.apiUrl}/uploads/resources/${resource.resourceUrl}`,
        '_blank'
      )
    },
    deleteResource() {
      this.$modal.hide('dialog')
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
}
</script>

<style lang="scss" scoped>
#admin-view-folder-page {
  .resource-files {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 2rem;

    .resource-file {
      grid-column: span 4;
      display: flex;
      align-items: center;
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
        max-width: 25%;
        border-radius: 5px;
        padding: 8px;
        .image-file-wrapper {
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .icon-wrapper {
          padding: 1rem;
          // width: 50%;
          svg {
            width: 40px;
            height: 40px;
            stroke: var(--primary-font-color);
          }
        }
      }
      .resource-file--right {
        width: 75%;
        padding: 16px;
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
          right: 8px;
          top: 10px;
          display: none;

          svg {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
