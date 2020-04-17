<template>
  <div class="resources">
    <h4>{{this.$route.params.resource}}</h4>
    <table class="resource-table" v-if="resources.resources && resources.resources.length>0">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Description</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr
          @click="gotoResourceURL(resource.resourceUrl)"
          v-for="resource in resources.resources"
          :key="resource._id"
          class="resource-file"
        >
          <td>
            <FileIcon />
          </td>
          <td>{{resource.name}}</td>
          <td>{{resource.description}}</td>
          <td>{{resource.createdAt}}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No resources available.</p>
  </div>
</template>


<script>
import FileIcon from '~/static/Icons/file.svg?inline'
import PictureIcon from '~/static/Icons/picture.svg?inline'
import PDFIcon from '~/static/Icons/pdf.svg?inline'

import { mapState } from 'vuex'

export default {
  components: {
    FileIcon,
    PictureIcon,
    PDFIcon
  },
  data() {
    return {
      apiStaticUrl: ''
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