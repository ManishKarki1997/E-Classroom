<template>
  <div id="class-assignments-page">
    <div class="class-top-header">
      <h3>Assignments</h3>
      <div class="create-assignment-button-wrapper" v-if="isTeacher">
        <button @click="handleCreateAssignment">
          <PlusIcon />Create An Assignment
        </button>
      </div>
    </div>

    <div class="assignments-wrapper">
      <transition-group class="assignments" tag="div" name="slide-fade">
        <div
          class="assignment"
          v-for="assignment in assignments"
          :key="assignment._id"
        >
          <div class="assignment--top" @click="viewAssignment(assignment)">
            <div class="assignment-meta-info-wrapper">
              <p class="subtitle">{{ assignment.createdAt | formatDate }}</p>
              <h5
                v-tooltip.top-start="{
                  content: 'Submitted / Total',
                  classes: ['info'],
                }"
              >
                {{ assignment.submittedBy.length }}/{{
                  currentlyViewingClass.users.length
                }}
              </h5>
            </div>

            <h4 class="assignment-title">{{ assignment.title }}</h4>
          </div>

          <div class="assignment--body" @click="viewAssignment(assignment)">
            <p v-html="assignment.description.slice(0, 150)"></p>
          </div>

          <div class="assignment--footer" @click="viewAssignment(assignment)">
            <p class="subtitle">
              Due Date {{ assignment.dueDate | formatDate }}
            </p>
          </div>

          <div class="more-options-icon-wrapper" v-if="isTeacher">
            <MoreHorizontalIcon @click.prevent="openContextMenu(assignment)" />
          </div>
        </div>
      </transition-group>
    </div>

    <Modal
      v-if="showCreateAssignmentModal"
      class="make-assignment-modal"
      @closeModal="closeCreateAssignemntModal"
    >
      <template slot="header">
        <h4>Create an assignment</h4>
      </template>

      <template slot="body">
        <form @submit.prevent="createAnAssignment">
          <div class="form-input">
            <label for="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              v-model="assignment.title"
            />
          </div>

          <div class="form-input">
            <label for="description">Description</label>
            <!-- <input type="text" name="description" id="description" v-model="assignment.description" /> -->
            <quill-editor
              class="quill-editor"
              ref="editor"
              v-model="assignment.description"
              :options="editorOption"
            />
          </div>

          <div class="form-input">
            <label for="dueDate">Due Date</label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              v-model="assignment.dueDate"
            />
          </div>

          <div class="form-buttons">
            <button type="submit">Create Assignment</button>
            <button @click="closeCreateAssignemntModal">Cancel</button>
          </div>
        </form>
      </template>
    </Modal>

    <Modal
      v-if="showEditAssignmentModal"
      class="make-assignment-modal"
      @closeModal="closeEditAssignmentModal"
    >
      <template slot="header">
        <h4>Update assignment</h4>
      </template>

      <template slot="body">
        <form @submit.prevent="editAssignment">
          <div class="form-input">
            <label for="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              v-model="selectedAssignment.title"
            />
          </div>

          <div class="form-input">
            <label for="description">Description</label>
            <!-- <input type="text" name="description" id="description" v-model="assignment.description" /> -->
            <quill-editor
              class="quill-editor"
              ref="editor"
              v-model="selectedAssignment.description"
              :options="editorOption"
            />
          </div>

          <div class="form-input">
            <label for="dueDate">Due Date</label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              v-model="selectedAssignment.dueDate"
            />
          </div>

          <div class="form-buttons">
            <button type="submit">Edit Assignment</button>
            <button @click="closeEditAssignmentModal">Cancel</button>
          </div>
        </form>
      </template>
    </Modal>

    <context-menu
      class="context-menu assignment-option-context-menu"
      ref="assignmentOptionContextMenu"
    >
      <li @click="showEditAssignmentModal = true">Edit</li>
      <li @click="handleDeleteAssignment">Delete</li>
    </context-menu>
    <v-dialog />
  </div>
</template>

<script>
import PlusIcon from '~/static/Icons/plus.svg?inline'
import { mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import Modal from '~/components/Modal'
import contextMenu from 'vue-context-menu'
import MoreHorizontalIcon from '~/static/Icons/more-horizontal.svg?inline'

import moment from 'moment'

export default {
  components: {
    PlusIcon,
    MoreHorizontalIcon,
    Modal,
    contextMenu,
  },
  computed: {
    ...mapGetters(['user', 'currentlyViewingClass', 'currentClassassignments']),
    isTeacher() {
      return this.currentlyViewingClass.createdBy._id === this.user._id
    },
  },
  data() {
    return {
      editorOption: {
        // Some Quill options...
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
          ],
        },
      },
      showCreateAssignmentModal: false,
      showEditAssignmentModal: false,
      assignment: {
        title: '',
        description: '',
        classId: '',
        dueDate: '',
        createdBy: '',
      },
      selectedAssignment: null,
      assignments: [],
    }
  },
  methods: {
    closeCreateAssignemntModal() {
      this.showCreateAssignmentModal = false
      this.assignment.title = ''
      this.assignment.description = ''
      this.assignment.dueDate = ''
      this.assignment.classId = ''
      this.assignment.createdBy = ''
    },
    async createAnAssignment() {
      this.assignment.classId = this.currentlyViewingClass._id
      this.assignment.createdBy = this.user._id
      if (
        this.assignment.title.trim() === '' ||
        this.assignment.dueDate === '' ||
        this.assignment.dueDate === '' ||
        this.assignment.classId === '' ||
        this.assignment.createdBy === ''
      ) {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Please fill all the fields',
          type: 'danger',
          dismissAfter: 3000,
        })
        return
      }
      const response = await this.$store.dispatch(
        'createAnAssignment',
        this.assignment
      )

      if (!response.data.error) {
        this.fetchClassAssignments()
        this.showCreateAssignmentModal = false
        this.closeCreateAssignemntModal()
      }
    },
    handleCreateAssignment() {
      this.showCreateAssignmentModal = true
    },
    async fetchClassAssignments() {
      const res = await this.$store.dispatch(
        'getUserAssignmentsForClass',
        this.currentlyViewingClass._id
      )
      this.assignments = res.data.payload.assignments
    },
    closeEditAssignmentModal() {
      this.showEditAssignmentModal = false
      this.selectedAssignment = null
    },
    async editAssignment() {
      if (
        this.selectedAssignment.title.trim() === '' ||
        this.selectedAssignment.dueDate === '' ||
        this.selectedAssignment.classId === '' ||
        this.selectedAssignment.createdBy === ''
      ) {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Please fill all the fields',
          type: 'danger',
          dismissAfter: 3000,
        })
        return
      }

      const tempIndex = this.selectedAssignment._id
      delete this.selectedAssignment._id
      const response = await this.$store.dispatch(
        'editAssignment',
        this.selectedAssignment
      )

      if (!response.data.error) {
        const index = this.assignments.findIndex(
          (assignment) => assignment._id === tempIndex
        )
        this.$set(this.assignments, index, response.data.payload.assignment)
        // this.fetchClassAssignments()
        this.showEditAssignmentModal = false
        this.closeEditAssignmentModal()
      }
    },
    async deleteAssignment() {
      const res = await this.$store.dispatch(
        'deleteAssignment',
        this.selectedAssignment._id
      )
      if (!res.data.error) {
        this.$modal.hide('dialog')
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: res.data.message,
          type: 'danger',
          dismissAfter: 3000,
        })
        this.assignments = this.assignments.filter(
          (assignment) => assignment._id !== this.selectedAssignment._id
        )
      }
    },
    async handleDeleteAssignment() {
      this.$modal.show('dialog', {
        title: 'Delete Assignment',
        text: 'Are you sure you want to delete the assignment?',
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
              this.deleteAssignment()
            },
          },
        ],
      })
    },
    openContextMenu(assignment) {
      this.selectedAssignment = {
        ...assignment,
        assignmentId: assignment._id,
        dueDate: moment(assignment.dueDate).format('yyyy-MM-DD'),
      }
      this.$refs.assignmentOptionContextMenu.open()
    },
    viewAssignment(assignment) {
      this.$router.push(
        `/app/class/${this.currentlyViewingClass._id}/assignments/${assignment._id}`
      )
    },
  },
  mounted() {
    this.fetchClassAssignments()
  },
  filters: {
    formatDate(value) {
      if (!value) return value

      return moment(value).format('yyyy-MM-DD')
    },
  },
}
</script>

<style lang="scss" scoped>
#class-assignments-page {
  .assignments-wrapper {
    margin-top: 2rem;
    padding: 1rem;

    .assignments {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-gap: 2rem;

      .assignment {
        grid-column: span 4;
        padding: 1rem;
        border-radius: 5px;
        background-color: var(--primary-background-color);
        cursor: pointer;
        position: relative;

        @include normalBoxShadow;
        transition: all 0.3s ease-in-out;

        &:hover {
          @include hoverBoxShadow;

          .more-options-icon-wrapper {
            display: block;
          }
        }

        .assignment--top {
          .assignment-meta-info-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .assignment-title {
            margin: 8px 0;
          }
        }

        .assignment--footer {
          margin-top: 8px;
        }

        .more-options-icon-wrapper {
          position: absolute;
          bottom: 8px;
          right: 8px;
          display: none;
        }
      }
    }
  }

  .create-assignment-button-wrapper {
    button {
      display: flex;
      align-items: center;
      svg {
        margin-right: 8px;
      }
      @include primaryButton;
      transition: all 0.3s ease-in-out;
      &:hover {
        background-color: var(--button-background-hover);
      }
    }
  }

  .make-assignment-modal {
    .form-buttons {
      button {
        &:first-child {
          @include primaryButton;
          transition: all 0.3s ease-in-out;
          &:hover {
            background-color: var(--button-background-hover);
          }
        }

        &:nth-child(2) {
          @include tertiaryButton;
          margin-left: 1rem;
        }
      }
    }
  }
}
</style>
