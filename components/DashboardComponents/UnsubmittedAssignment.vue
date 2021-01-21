<template>
  <div class="unsubmitted-assignments-wrapper">
    <h2>Unsubmitted Assignments</h2>
    <p v-if="filteredAssignments.length == 0" style="margin-top: 4px">
      No assignments
    </p>

    <transition-group
      v-if="filteredAssignments.length > 0"
      class="user-assignments"
      tag="div"
      name="slide-fade"
    >
      <div
        class="assignment"
        v-for="assignment in filteredAssignments.slice(0, assignmentToShow)"
        :key="assignment._id"
      >
        <div class="assignment-class-wrapper">
          <img
            :src="
              apiUrl + '/uploads/images/' + assignment.classId.backgroundImage
            "
            alt
          />
        </div>
        <div class="assignment-content-wrapper">
          <div class="assignment--top" @click="viewAssignment(assignment)">
            <div class="assignment-meta-info-wrapper">
              <p class="subtitle">{{ assignment.createdAt | formatDate }}</p>
              <!-- <div class="assignment-class-info-wrapper">
                <h4>{{ assignment.classId.name }}</h4>
              </div>-->
            </div>
          </div>

          <div class="assignment--body" @click="viewAssignment(assignment)">
            <h4 class="assignment-title">{{ assignment.title }}</h4>
          </div>

          <div class="assignment--footer" @click="viewAssignment(assignment)">
            <p class="subtitle">
              Due Date {{ assignment.dueDate | formatDate }}
            </p>
          </div>
        </div>

        <div class="more-options-icon-wrapper">
          <MoreHorizontalIcon @click.prevent="openContextMenu(assignment)" />
        </div>
      </div>
      <div
        class="placeholder-assignment"
        :key="Date.now.toString()"
        v-if="filteredAssignments.length >= assignmentToShow + 1"
      >
        <p class="subtitle">
          And {{ filteredAssignments.length - assignmentToShow }} more
        </p>
      </div>
    </transition-group>

    <Modal
      v-if="showDetailedAssignmentInformation"
      class="submit-assignment-modal"
      @closeModal="showDetailedAssignmentInformation = false"
    >
      <template slot="header">
        <h4>{{ selectedAssignment.classId.name }}</h4>
      </template>

      <template slot="body">
        <h4>{{ selectedAssignment.title }}</h4>
        <div v-html="selectedAssignment.description"></div>
      </template>

      <template slot="footer">
        <button type="submit" @click="handleAssignmentSubmit">
          Submit Assignment
        </button>
        <button @click="showDetailedAssignmentInformation = false">
          Close
        </button>
      </template>
    </Modal>

    <Modal
      v-if="showSubmitAssignmentModal"
      class="submit-assignment-modal"
      @closeModal="showSubmitAssignmentModal = false"
    >
      <template slot="header">
        <h4>Submit assignment</h4>
      </template>

      <template slot="body">
        <form @submit.prevent="submitAssignment">
          <div class="form-input">
            <quill-editor
              class="quill-editor"
              ref="editor"
              v-model="toBeSubmittedAssignment.note"
              :options="editorOption"
            />
          </div>

          <div class="form-input">
            <label for="assignmentFile">Assignment File</label>
            <input
              type="file"
              name="assignmentFile"
              id="assignmentFile"
              @change="assignmentFileSelected"
            />
          </div>

          <div class="form-buttons">
            <button type="submit">Submit</button>
            <button @click="showSubmitAssignmentModal = false">Cancel</button>
          </div>
        </form>
      </template>
    </Modal>

    <context-menu
      class="context-menu assignment-option-context-menu"
      ref="assignmentOptionContextMenu"
    >
      <li @click="handleAssignmentSubmit">Submit Assignment</li>
    </context-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

import MoreHorizontalIcon from '~/static/Icons/more-horizontal.svg?inline'
import contextMenu from 'vue-context-menu'
import Modal from '~/components/Modal'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  components: {
    MoreHorizontalIcon,
    contextMenu,
  },
  data() {
    return {
      editorOption: {
        theme: 'snow',
        placeholder: 'Write a note (optional)',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
          ],
        },
      },
      selectedAssignment: null,
      assignmentToShow: 5,
      showSubmitAssignmentModal: false,
      showDetailedAssignmentInformation: false,
      toBeSubmittedAssignment: {
        note: '',
        userId: '',
        assignmentId: '',
        assignmentFile: null,
      },
    }
  },

  computed: {
    ...mapState(['userAssignments', 'apiUrl', 'user']),
    filteredAssignments() {
      const assignments = []
      this.userAssignments.forEach((assignment) => {
        if (
          moment(assignment.dueDate, 'YYYY-MM-DD').isAfter(
            moment().format('YYYY-MM-DD')
          ) &&
          assignment.yetToBeSubmittedBy.indexOf(this.user._id) > -1
        ) {
          assignments.push(assignment)
        }
      })
      return assignments
    },
  },
  methods: {
    fetchUserAssignments() {
      this.$store.dispatch('getUserAssignments', this.sortByOption)
    },
    viewAssignment(assignment) {
      this.selectedAssignment = assignment
      this.showDetailedAssignmentInformation = true
    },
    handleAssignmentSubmit() {
      this.showDetailedAssignmentInformation = false
      this.showSubmitAssignmentModal = true
    },
    async submitAssignment() {
      if (this.toBeSubmittedAssignment.assignmentFile == null) {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Please select the assignment file to submit.',
          type: 'danger',
          dismissAfter: 3000,
        })
        return
      }

      const formData = new FormData()
      formData.append('userId', this.user._id)
      formData.append('assignmentId', this.selectedAssignment._id)
      formData.append(
        'assignmentFile',
        this.toBeSubmittedAssignment.assignmentFile
      )
      formData.append('note', this.toBeSubmittedAssignment.note)

      const res = await this.$store.dispatch('submitAssignment', formData)

      this.toBeSubmittedAssignment.assignmentFile = ''
      this.showSubmitAssignmentModal = false
      this.selectedAssignment = null
      this.toBeSubmittedAssignment.note = ''
      this.fetchUserAssignments()
    },
    assignmentFileSelected(e) {
      this.toBeSubmittedAssignment.assignmentFile = e.target.files[0]
    },
    openContextMenu(assignment) {
      this.selectedAssignment = {
        ...assignment,
        assignmentId: assignment._id,
        dueDate: moment(assignment.dueDate).format('yyyy-MM-DD'),
      }
      this.$refs.assignmentOptionContextMenu.open()
    },
  },
  created() {
    this.fetchUserAssignments()
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
.unsubmitted-assignments-wrapper {
  margin-top: 2rem;
  background-color: var(--primary-background-color);
  border-radius: 5px;
  padding: 2rem;
  // color: #d6eaff;
  // color: var(--opposite-font-color);
  color: var(--primary-font-color);

  @include normalBoxShadow;
  transition: all 0.3s ease-in-out;

  &:hover {
    @include hoverBoxShadow;
  }

  .user-assignments {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 2rem;
    margin-top: 2rem;

    .assignment {
      grid-column: span 4;
      padding: 1rem;
      border-radius: 5px;
      background-color: var(--primary-background-color);
      cursor: pointer;
      position: relative;
      display: flex;

      @include normalBoxShadow;
      transition: all 0.3s ease-in-out;

      &:hover {
        @include hoverBoxShadow;

        .more-options-icon-wrapper {
          display: block;
        }
      }

      .more-options-icon-wrapper {
        position: absolute;
        top: 8px;
        right: 8px;
        display: none;
      }

      .assignment-class-wrapper {
        margin-right: 1rem;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }

      .assignment-content-wrapper {
        width: 100%;

        .assignment--top {
          display: flex;
          align-items: center;

          .assignment-meta-info-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;

            .assignment-class-info-wrapper {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;

              h4 {
                margin-top: 4px;
              }
            }
          }
        }
        .assignment--body {
          .assignment-title {
            margin: 4px 0;
            color: var(--primary-font-color);
          }
        }
      }
    }

    .placeholder-assignment {
      grid-column: span 4;
      padding: 1rem;
      border-radius: 5px;
      cursor: pointer;

      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed var(--primary-border-color);
    }
  }
}
</style>
