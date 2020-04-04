<template>
  <div id="resources">
    <div class="add-resource-button">
      <button @click="toggleModal(true)">Add</button>
    </div>
    <div class="resource-files">
      <div class="resource">
        <h4>{{this.$route.params.resource}}</h4>
        <table class="resource-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              @click="gotoResourceURL(`${apiStaticUrl}/uploads/resources/${file.resourceUrl}`)"
              v-for="(file,index) in resources"
              :key="file.resourceId"
              class="resource-file"
            >
              <td>
                {{index+1}}
                <!--                 
                <FileIcon v-if="file.fileType==='other'" />
                <PictureIcon v-if="file.fileType==='image'" />
                <PDFIcon v-if="file.fileType==='office'" />-->
              </td>
              <td>{{file.name}}</td>
              <td>{{file.createdAt}}</td>
            </tr>
          </tbody>
        </table>
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

import { mapState } from 'vuex'

export default {
  components: {
    FileIcon,
    PictureIcon,
    PDFIcon,
    AddResourceModal
  },
  data() {
    return {
      resources: [
        {
          resourceId: 'resource001',
          resourceType: 'office',
          resourceURL: 'http://google.com',
          uploadDate: '7th March, 2020',
          resourceName: 'Unit 1 Notes'
        },
        {
          resourceId: 'resource002',
          resourceType: 'office',
          resourceURL: 'http://google.com',
          uploadDate: '12th March, 2020',
          resourceName: 'Unit 2 Notes'
        },
        {
          resourceId: 'resource003',
          resourceType: 'office',
          resourceURL: 'http://google.com',
          uploadDate: '15th March, 2020',
          resourceName: 'Unit 3 Notes'
        },
        {
          resourceId: 'resource004',
          resourceType: 'image',
          resourceURL: 'http://google.com',
          uploadDate: '13th March, 2020',
          resourceName: 'ER Diagram Schema'
        },
        {
          resourceId: 'resource005',
          resourceType: 'other',
          resourceURL: 'http://google.com',
          uploadDate: '19th March, 2020',
          resourceName: 'Podcast'
        }
      ],
      showAddResourceModal: false,
      apiStaticUrl: ''
    }
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
          message: 'New file added successfully',
          position: 'top-right',
          duration: 1500
        })
        this.resources.push(response.data.payload.result)
        this.$forceUpdate()

        // hide the modal
        this.showAddResourceModal = false
      }
    }
  },
  computed: mapState({
    currentlyViewingClass: state => state.currentlyViewingClass
  }),
  mounted() {
    this.fetchAllResources()
    this.apiStaticUrl = process.env.baseUrl
  }
}
</script>

<style lang="scss" scoped>
#resources {
  // padding: 14px 2rem;
  color: black;
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
  tr:hover {
    // background-color: white;
    cursor: pointer;
  }
  tr:hover td {
    color: #434c5e;
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