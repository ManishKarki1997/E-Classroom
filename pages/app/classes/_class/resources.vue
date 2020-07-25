<template>
  <div id="resources">
    <div
      class="add-resource-button"
      v-if="currentlyViewingClass.createdBy._id === this.$store.state.user._id"
    >
      <button @click="toggleModal(true)">Add</button>
    </div>
    <div class="resource-files">
      <div class="resource">
        <h4>{{ this.$route.params.resource }}</h4>

        <div v-if="resources && resources.length>0" class="resources-wrapper">
          <div v-for="(file) in resources" :key="file.resourceId" class="resource-item">
            <div class="resource-top-wrapper">
              <div class="resource-icon">
                <FileIcon v-if="file.fileType==='other'" />
                <img
                  v-if="file.fileType==='image'"
                  :src="apiStaticUrl + '/uploads/resources/' + file.resourceUrl"
                  alt="Resource Image"
                />
                <ZipIcon v-if="file.fileType==='zip'" />
                <!-- <PictureIcon v-if="file.fileType==='image'" /> -->
                <PDFIcon v-if="file.fileType==='office'" />
              </div>

              <div class="actions-icon">
                <StarIcon @click="saveResource(file._id)" />
                <DeleteIcon @click="deleteResource(file._id)" />
              </div>
            </div>
            <h4>{{file.name}}</h4>
            <p>{{file.description}}</p>
            <p class="resource-uploaded-date">{{file.createdAt | formatDate}}</p>
          </div>
        </div>
        <!-- <table class="resource-table" v-if="resources && resources.length > 0">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, index) in resources" :key="file.resourceId" class="resource-file">
              <td>
                {{ index + 1 }}
            
              </td>
              <td
                @click="
                  gotoResourceURL(
                    `${apiStaticUrl}/uploads/resources/${file.resourceUrl}`
                  )
                "
              >{{ file.name }}</td>
              <td>{{ file.createdAt | formatDate }}</td>
              <td class="actions-icons">
                <StarIcon @click="saveResource(file._id)" />
                <DeleteIcon @click="deleteResource(file._id)" />
              </td>
            </tr>
          </tbody>
        </table>-->
        <p v-else>No Resources</p>
      </div>
    </div>
    <AddResourceModal
      @hideModal="toggleModal"
      @addNewResource="addNewResource"
      v-if="showAddResourceModal"
      :classId="currentlyViewingClass._id"
    />
  </div>
</template>

<script>
import AddResourceModal from '~/components/DashboardComponents/AddResourceModal'

import FileIcon from '~/static/Icons/file.svg?inline'
import PictureIcon from '~/static/Icons/picture.svg?inline'
import PDFIcon from '~/static/Icons/pdf.svg?inline'
import ZipIcon from '~/static/Icons/zip.svg?inline'
import StarIcon from '~/static/Icons/star.svg?inline'
import DeleteIcon from '~/static/Icons/bin.svg?inline'

import { mapState, mapGetters } from 'vuex'
import dayjs from 'dayjs'
export default {
  components: {
    FileIcon,
    PictureIcon,
    PDFIcon,
    StarIcon,
    AddResourceModal,
    DeleteIcon,
    ZipIcon
  },
  data() {
    return {
      resources: [],
      showAddResourceModal: false,
      apiStaticUrl: ''
    }
  },
  computed: {
    ...mapGetters({
      currentlyViewingClass: 'getCurrentlyViewingClass',
      currentUser: 'getUserInfo'
    })
  },
  methods: {
    toggleModal(value) {
      this.showAddResourceModal = value
      this.$emit('addResourceModalActive', this.showAddResourceModal)
    },
    gotoResourceURL(url) {
      window.open(url, '_blank')
    },

    async fetchAllResources() {
      const response = await this.$store.dispatch('fetchAllResources', {
        classId: this.currentlyViewingClass._id
      })
      if (response.error) {
        this.$toast.open({
          type: 'error',
          message: response.message,
          position: 'top-right',
          duration: 1500
        })
        return false
      } else {
        this.resources = response.data.payload.resources
      }
    },

    async addNewResource(newResource) {
      // dispatch an action to the store to add new resource
      const response = await this.$store.dispatch('addNewResource', {
        newResource
      })

      if (response.data.error) {
        this.$toast.open({
          type: 'error',
          message: response.data.message,
          position: 'top-right',
          duration: 1500
        })
        return false
      } else {
        // add the new resource to the array and force an update
        this.$toast.open({
          type: 'success',
          message: response.data.payload.message,
          position: 'top-right',
          duration: 1500
        })

        // emit an event to notify a new resource has been created
        // so, send a notification to all the intended recipients
        this.$socket.emit('new_notification', {
          classId: this.$route.params.class,
          notification: {
            type: 'RESOURCE_CREATED',
            resourceUrl: response.data.resourceUrl,
            _id: response.data._id
          }
        })
        this.resources.push(response.data.payload.result)
        this.$forceUpdate()

        // hide the modal
        this.showAddResourceModal = false
        this.$emit('addResourceModalActive', this.showAddResourceModal)
      }
    },
    async saveResource(resourceId) {
      const res = await this.$store.dispatch(
        'addResourceToCollection',
        resourceId
      )
      if (res.data.error) {
        this.$toast.open({
          type: 'error',
          message: res.data.message,
          position: 'top-right',
          duration: 1500
        })
        return false
      } else {
        this.$toast.open({
          type: 'success',
          message: res.data.message,
          position: 'top-right',
          duration: 1500
        })
        this.$forceUpdate()
      }
    },
    async deleteResource(resourceId) {
      const answer = confirm('Are you sure you want to delete the resource?')
      if (!answer) {
        return
      }
      const response = await this.$store.dispatch('deleteResource', {
        userId: this.userId,
        classId: this.classId,
        resourceId
      })

      if (response.data.error) {
        this.$toast.open({
          type: 'error',
          message: this.response.data.message,
          position: 'top-right',
          duration: 1500
        })
        return false
      } else {
        this.fetchAllResources()
        this.$forceUpdate()
      }
    }
  },
  computed: mapState({
    currentlyViewingClass: state => state.currentlyViewingClass,
    userId: state => state.user._id,
    classId: state => state.currentlyViewingClass._id
  }),
  filters: {
    formatDate(value) {
      return dayjs(value).format('MMMM DD, h:mm')
    }
  },
  mounted() {
    this.fetchAllResources()
    this.apiStaticUrl = process.env.baseUrl
  }
}
</script>

<style lang="scss" scoped>
.resources-wrapper {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 2rem 3rem;
  margin-top: 2rem;

  .resource-item {
    grid-column: span 3;

    h4 {
      font-size: 16px;
    }

    p {
      font-size: 14px;
      margin-top: 4px;
    }

    p.resource-uploaded-date {
      font-size: 12px;
      font-style: italic;
    }

    &:hover .resource-top-wrapper .actions-icon {
      // display: block;
      opacity: 1;
    }

    .resource-top-wrapper {
      display: flex;
      justify-content: space-between;

      .actions-icon {
        opacity: 0;
        transition: all 0.3s;
        svg {
          width: 15px;
          height: 15px;
          cursor: pointer;
          &:first-child {
            fill: coral !important;
          }
          &:last-child {
            margin-left: 4px;
            fill: lightgreen !important;
          }
        }
      }

      .resource-icon {
        // width: 100%;
        width: 80px;
        height: 80px;
        margin-bottom: 16px;
        cursor: pointer;
        svg {
          margin-right: auto;
          width: 100%;
          height: 100%;
        }

        img {
          // height: 80px;
          width: 130px;
          height: auto;
          border-radius: 5px;
          margin-bottom: 16px;
        }
      }
    }
  }
}
#resources {
  // padding: 14px 2rem;
  // color: black;
  color: var(--secondary-font-color);
  display: flex;
  flex-direction: column;
  width: 100%;

  .add-resource-button {
    margin-top: 1rem;
    button {
      padding: 6px 24px;
      background-color: #434c5e;
      color: white;
      cursor: pointer;
    }
  }
}

.resource-files {
  width: 80%;
  height: 100%;
  padding: 10px 16px;
}

.resource-table {
  width: 100%;
  margin-top: 8px;

  td,
  th {
    text-align: left;
  }

  th {
    font-weight: normal;
    padding: 6px;
  }
  td {
    font-size: 14px;
    padding: 6px;
    color: #858ea1;
  }
  tr {
    transition: all 0.3s ease-in;
  }

  tr:hover td {
    color: #434c5e;
  }
  .actions-icons {
    width: 80px;
    height: auto;
    display: flex;
    align-items: center;
    svg {
      display: none;
      width: 14px;
      height: 14px;
      fill: lightcoral;
      cursor: pointer;
      margin-right: 16px;
    }
  }
  tr:hover .actions-icons svg {
    display: block;
  }
  thead tr:hover {
    background-color: transparent;
  }
  thead tr td {
    color: inherit;
  }
}
.resource-file {
  svg {
    width: 16px;
    height: 16px;
    fill: #191c28;
  }
}
</style>
