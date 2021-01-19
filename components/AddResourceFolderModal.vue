<template>
  <div class="modal-background-wrapper">
    <div class="modal-content-wrapper">
      <div class="modal-header">
        <h2>Add a folder</h2>
        <CloseIcon @click="closeModal" />
      </div>
      <div class="modal-body">
        <div class="add-folder-wrapper">
          <form @submit.prevent="addFolder">
            <div class="form-input">
              <label for="folderName">Folder Name</label>
              <input
                v-model="newFolderName"
                type="text"
                name="folderName"
                id="folderName"
              />
            </div>

            <div class="form-button">
              <button type="submit">Create Folder</button>
            </div>
          </form>
        </div>
      </div>
      <div class="modal-footer">
        <p>Want to add a resource instead?</p>
        <button @click="switchAddModal">Add Resource</button>
      </div>
    </div>
  </div>
</template>

<script>
import CloseIcon from '~/static/Icons/x-circle.svg?inline'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { mapGetters } from 'vuex'
export default {
  components: {
    CloseIcon,
  },
  data() {
    return {
      newFolderName: '',
    }
  },
  computed: {
    ...mapGetters(['user', 'currentlyViewingClass']),
  },
  methods: {
    closeModal() {
      this.$emit('closeAddResourceFolderModal')
    },
    switchAddModal() {
      this.$emit('switchAddModal')
    },
    addFolder() {
      if (this.newFolderName.trim() === '') {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Please type in the folder name.',
          type: 'danger',
          dismissAfter: 3000,
        })
        return false
      }

      const payload = {
        folderName: this.newFolderName,
        userId: this.user._id,
        isForClass: true,
        classId: this.currentlyViewingClass._id,
      }

      this.$emit('createFolder', payload)
    },
  },
}
</script>

<style lang="scss" scoped>
.modal-background-wrapper {
  background-color: rgba(0, 0, 0, 0.8);
  width: 100vw;
  height: 90vh;
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
    min-width: 500px;
    min-height: 400px;
    padding: 2rem;

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-body {
      margin: 3rem 0;

      .form-input {
        padding: 0;
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
