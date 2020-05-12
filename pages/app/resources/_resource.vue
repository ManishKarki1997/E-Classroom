<template>
  <div class="resources">
    <div v-if="resources.className && resources.resources && resources.resources.length>0">
      <h3>{{this.$route.params.resource}}</h3>
      <table class="resource-table">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Name</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr
            @mouseover="currentlyHoveredResource=resource._id"
            @mouseleave="currentlyHoveredResource=''"
            v-for="resource in resources.resources"
            :key="resource._id"
            class="resource-file"
          >
            <td @click="saveResource(resource._id)">
              <StarIcon />
              <!-- <FileIcon /> -->
            </td>
            <td @click="gotoResourceURL(resource.resourceUrl)">{{resource.name}}</td>
            <td>{{resource.description}}</td>
            <td>{{resource.createdAt | formatDate}}</td>
            <img
              v-if="currentlyHoveredResource===resource._id && resource.resourceUrl.match(/\.(jpeg|jpg|gif|png)$/) != null"
              class="resource-image"
              src="https://w.wallhaven.cc/full/md/wallhaven-md5z28.jpg"
              alt
            />
          </tr>
        </tbody>
      </table>
    </div>

    <div class="saved-resource" v-else-if="!resources.className">
      <!-- User Saved Resource : Single Resource -->
      <h3>{{resources.name}}</h3>
      <p>{{resources.description}}</p>
      <button v-if="resources.resourceUrl" @click="gotoResourceURL(resources.resourceUrl)">View</button>
    </div>
    <p v-else>No resources available.</p>
  </div>
</template>


<script>
import FileIcon from '~/static/Icons/file.svg?inline'
import PictureIcon from '~/static/Icons/picture.svg?inline'
import PDFIcon from '~/static/Icons/pdf.svg?inline'
import StarIcon from '~/static/Icons/star.svg?inline'

import { mapState } from 'vuex'
import dayjs from 'dayjs'

export default {
  components: {
    FileIcon,
    PictureIcon,
    PDFIcon,
    StarIcon
  },
  data() {
    return {
      apiStaticUrl: '',
      currentlyHoveredResource: ''
    }
  },
  computed: mapState({
    resources: state => state.selectedResourceContents
  }),
  methods: {
    gotoResourceURL(fileName) {
      window.open(
        `${this.apiStaticUrl}/uploads/resources/${fileName}`,
        '_blank'
      )
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
    }
  },
  filters: {
    formatDate(value) {
      return dayjs(value).format('MMMM DD, h:mm')
    }
  },
  mounted() {
    this.apiStaticUrl = process.env.baseUrl
  }
}
</script>

<style lang="scss" scoped>
.resource-table {
  width: 100%;
  margin-top: 16px;

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

  tbody tr {
    position: relative;
    transform: scale(1); //hack because position absolute/relative does not work
  }

  tr td:first-child,
  tr td:nth-child(2) {
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
  &:hover td:first-child svg {
    visibility: visible;
  }

  td:first-child svg {
    visibility: hidden;
  }
  svg {
    width: 16px;
    height: 16px;
    fill: #191c28;
  }
}
.resource-image {
  position: absolute;
  z-index: 10;
  right: 2rem;
  bottom: 0rem;
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}

.saved-resource {
  // p:first-child {
  //   font-weight: 700;
  // }
  p:nth-child(2) {
    font-style: italic;
    font-size: 14px;
    margin-top: 8px;
  }

  button {
    background-color: var(--primary-background-color);
    color: var(--primary-font-color);
  }
}
</style>