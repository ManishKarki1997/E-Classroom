<template>
  <div class="modal-background-wrapper">
    <div class="modal-content-wrapper">
      <div class="modal-header">
        <h2>Add a resource</h2>
        <CloseIcon @click="closeModal" />
      </div>
      <div class="modal-body">
        <div class="add-folder-wrapper">
          <form @submit.prevent="addResource">
            <div class="form-input">
              <label for="resourceName">Resource Name</label>
              <input
                v-model="newResource.name"
                type="text"
                name="resourceName"
                id="resourceName"
              />
            </div>

            <div class="form-input">
              <label for="resourceDescription">Description</label>
              <textarea
                v-model="newResource.description"
                name="resourceDescription"
                id="resourceDescription"
                cols="25"
                rows="6 "
              ></textarea>
            </div>

            <div class="form-input">
              <label for="folderName">Folder</label>
              <select
                placeholder="Select a folder"
                v-model="newResource.folderId"
                name="folderName"
                id="folderName"
              >
                <option
                  :value="folder._id"
                  v-for="folder in currentClassResourceFolders"
                  :key="folder._id"
                >
                  {{ folder.folderName }}
                </option>
              </select>
            </div>

            <div class="form-input">
              <label for="resourceFile">
                File Upload
                <!-- <UploadIcon style="height:16px;width:16px;" /> -->
              </label>
              <input
                type="file"
                name="resourceFile"
                id="resourceFile"
                @change="onFileChanged"
              />
            </div>

            <div class="form-button">
              <button type="submit">Add Resource</button>
            </div>
          </form>
        </div>
      </div>
      <div class="modal-footer">
        <p>Want to create a folder instead?</p>
        <button @click="switchAddModal">Create Folder</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import CloseIcon from '~/static/Icons/x-circle.svg?inline'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  components: {
    CloseIcon,
  },
  data() {
    return {
      newResource: {
        name: '',
        description: '',
        createdBy: '',
        classId: '',
        fileType: '',
        folderId: ' ',
      },
      resourceFile: null,
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'currentlyViewingClass',
      'currentClassResourceFolders',
    ]),
  },
  methods: {
    onFileChanged(e) {
      this.resourceFile = e.target.files[0]
    },
    closeModal() {
      this.$emit('closeAddResourceModal')
    },
    switchAddModal() {
      this.$emit('switchAddModal')
    },
    addResource() {
      this.newResource.classId = this.currentlyViewingClass._id
      this.newResource.createdBy = this.user._id

      if (
        this.newResource.name === '' ||
        this.newResource.description === '' ||
        this.newResource.createdBy === '' ||
        this.newResource.classId === '' ||
        this.newResource.folderId.trim() === '' ||
        this.resourceFile === null
      ) {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Please fill in all the fields',
          type: 'danger',
          dismissAfter: 3000,
        })
        return false
      }
      let formData = new FormData()
      formData.append('name', this.newResource.name)
      formData.append('description', this.newResource.description)
      formData.append('classId', this.currentlyViewingClass._id)
      formData.append('userId', this.$store.state.user._id)
      formData.append('createdBy', this.newResource.createdBy)
      formData.append('resource', this.resourceFile)
      formData.append('folderId', this.newResource.folderId)
      // emit an event to the parent to add new resource
      this.$emit('addNewResource', formData)
    },
  },
}
</script>

<style lang="scss" scoped>
.modal-background-wrapper {
  background-color: rgba(0, 0, 0, 0.8);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 6rem;

  .modal-content-wrapper {
    background-color: var(--primary-background-color);
    color: var(--primary-font-color);
    // padding: 1.5rem 2rem;
    border-radius: 5px;
    min-width: 700px;
    height: 600px;
    padding: 2rem;

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-body {
      margin: 1rem 0;
      overflow: auto;

      .form-input {
        padding: 0;
        margin-bottom: 16px;
      }

      textarea,
      select {
        background-color: var(--primary-background-color);
        color: var(--primary-font-color);
        padding: 8px;
      }

      .form-button {
        margin-top: 1.5rem;
        button {
          @include primaryButton;
        }
      }
    }

    .modal-footer {
      display: flex;
      align-items: center;

      p {
        margin-right: 8px;
      }
      button {
        @include tertiaryButton;
      }
    }
  }
}
</style>
