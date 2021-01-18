<template>
  <div class="bookmarked-resources-wrapper">
    <h2>Bookmarked Resources</h2>
    <table v-if="mostPopulatedUserResourceFolder">
      <thead>
        <tr>
          <th>Name</th>
          <th>Uploaded on</th>
          <!-- <th>Folder</th> -->
          <th>Size</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="resource in mostPopulatedUserResourceFolder.folder.resources"
          :key="resource._id"
          @click="viewResourceFile(resource.resourceUrl)"
        >
          <td class="resource-name">
            <div
              v-if="resource.fileType === 'image'"
              class="image-file-wrapper"
            >
              <img
                :src="apiUrl + '/uploads/resources/' + resource.resourceUrl"
                alt="Resource File Image"
              />
            </div>
            <div
              class="icon-wrapper"
              v-else-if="resource.fileType === 'office'"
            >
              <PDFIcon />
            </div>
            <div class="icon-wrapper" v-else-if="resource.fileType === 'zip'">
              <ZipIcon />
            </div>
            {{ resource.name }}
          </td>
          <td>{{ resource.createdAt | formatDate }}</td>
          <!-- <td>{{ mostPopulatedUserResourceFolder.folder.folderName }}</td> -->
          <td>{{ resource.fileSize | convertFileSize }}</td>
          <td>{{ resource.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import ZipIcon from '~/static/Images/zip.svg?inline'
import PDFIcon from '~/static/Images/pdf.svg?inline'

export default {
  components: {
    ZipIcon,
    PDFIcon,
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['apiUrl', 'userBookmarkedFolders']),
    mostPopulatedUserResourceFolder() {
      const allFolders = []
      this.userBookmarkedFolders.forEach((folder, index) =>
        allFolders.push({
          index,
          length: folder.resources.length,
          folder,
        })
      )
      const mostPopulated = allFolders.sort((a, b) => a.length - b.length)
      return mostPopulated[0]
    },
  },
  methods: {
    fetchUserResourceFolders() {
      this.$store.dispatch('fetchUserResourceFolders')
    },
    viewResourceFile(resourceUrl) {
      window.open(`${this.apiUrl}/uploads/resources/${resourceUrl}`, '_blank')
    },
  },
  mounted() {
    this.fetchUserResourceFolders()
  },
  filters: {
    convertFileSize(fileSize) {
      if (!fileSize || fileSize === '') return fileSize

      return Math.floor(fileSize / 1024 / 1024) === 0
        ? `${Math.floor(fileSize / 1024)} KB`
        : `${Math.floor(fileSize / 1024 / 1024)} MB`
    },
    formatDate(value) {
      return dayjs(value).format('MMMM DD')
    },
  },
}
</script>

<style lang="scss" scoped>
.bookmarked-resources-wrapper {
  margin-top: 2rem;
  padding-top: 1rem;

  h2 {
    margin: 1rem 0;
  }

  table {
    width: 100%;
    border-spacing: 0 1em;

    tr {
      text-align: left;
    }
    td,
    th {
      padding: 8px;
      padding: 16px;
    }

    tr {
      background-color: var(--secondary-background-color);
      border-radius: 5px;
      transition: all 0.3s ease-in-out;
      margin-bottom: 1rem;
      &:hover {
        background-color: var(--primary-background-color);
        @include normalBoxShadow;
      }
    }

    thead {
      tr {
        &:hover {
          background-color: transparent;
          box-shadow: none;
        }
      }
    }

    tbody {
      td {
        &.resource-name {
          display: flex;

          img {
            margin-right: 8px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }

          .icon-wrapper {
            margin-right: 8px;
            svg {
              width: 30px;
              height: 30px;
              stroke: var(--primary-font-color);
            }
          }
        }
      }
    }
  }
}
</style>
