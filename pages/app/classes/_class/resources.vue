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
        <table class="resource-table" v-if="resources && resources.length > 0">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(file, index) in resources"
              :key="file.resourceId"
              class="resource-file"
            >
              <td>
                {{ index + 1 }}
                <!--                 
                <FileIcon v-if="file.fileType==='other'" />
                <PictureIcon v-if="file.fileType==='image'" />
                <PDFIcon v-if="file.fileType==='office'" />-->
              </td>
              <td
                @click="
                  gotoResourceURL(
                    `${apiStaticUrl}/uploads/resources/${file.resourceUrl}`
                  )
                "
              >
                {{ file.name }}
              </td>
              <td>{{ file.createdAt | formatDate }}</td>
              <td class="delete-icon">
                <DeleteIcon @click="deleteResource(file._id)" />
              </td>
            </tr>
          </tbody>
        </table>
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
import DeleteIcon from '~/static/Icons/bin.svg?inline'

import { mapState, mapGetters } from 'vuex'
import dayjs from 'dayjs'
export default {
  components: {
    FileIcon,
    PictureIcon,
    PDFIcon,
    AddResourceModal,
    DeleteIcon
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
    async deleteResource(resourceId) {
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
  .delete-icon {
    text-align: center;
    width: 40px;
    height: auto;
    svg {
      display: none;
      width: 14px;
      height: 14px;
      fill: lightcoral;
      cursor: pointer;
    }
  }
  tr:hover .delete-icon svg {
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
