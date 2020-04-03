<template>
  <div id="resources">
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
              @click="gotoResourceURL(file.resourceURL)"
              v-for="file in resource"
              :key="file.resourceId"
              class="resource-file"
            >
              <td>
                <FileIcon v-if="file.resourceType==='other'" />
                <PictureIcon v-if="file.resourceType==='image'" />
                <PDFIcon v-if="file.resourceType==='office'" />
              </td>
              <td>{{file.resourceName}}</td>
              <td>{{file.uploadDate}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import FileIcon from '~/static/Icons/file.svg?inline'
import PictureIcon from '~/static/Icons/picture.svg?inline'
import PDFIcon from '~/static/Icons/pdf.svg?inline'

export default {
  components: {
    FileIcon,
    PictureIcon,
    PDFIcon
  },
  data() {
    return {
      resource: [
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
      ]
    }
  },
  methods: {
    gotoResourceURL(url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
#resources {
  // padding: 14px 2rem;
  color: black;
  display: flex;
  width: 100%;
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