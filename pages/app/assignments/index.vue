<template>
  <div id="assignments-page">
    <div class="page-header">
      <h2>Assignments</h2>
      <div class="sort-options-wrapper">
        <label for="sortBy">Sort By</label>
        <select name="sortBy" id="sortBy" v-model="sortByOption" @change="sortByOptionChanged">
          <option value="notSubmitted">Not Submitted</option>
          <option value="dueDate">Due Date</option>
          <option value="createdAt">Created Date</option>
        </select>
      </div>
    </div>

    <transition-group class="user-assignments" tag="div" name="slide-fade">
      <div class="assignment" v-for="assignment in userAssignments" :key="assignment._id">
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
              </div>-->
            </div>
          </div>

          <div class="assignment--body" @click="viewAssignment(assignment)">
            <p class="assignment-title">{{ assignment.title }}</p>
          </div>

          <div class="assignment--footer" @click="viewAssignment(assignment)">
            <p
              class="subtitle"
              v-if="expiredAssignments.indexOf(assignment._id) == -1"
            >Due Date {{ assignment.dueDate | formatDate }}</p>
            <p
              class="subtitle"
              v-else
              v-tooltip.top-start="{
                content: 'Due date has expired',
                classes: ['info'],
              }"
            >Expired</p>
          </div>
        </div>

        <div class="more-options-icon-wrapper">
          <MoreHorizontalIcon @click.prevent="openContextMenu(assignment)" />
        </div>
      </div>
    </transition-group>

    <context-menu
      class="context-menu assignment-option-context-menu"
      ref="assignmentOptionContextMenu"
    >
      <li @click="handleAssignmentSubmit">Submit Assignment</li>
    </context-menu>

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
        <button type="submit" @click="handleAssignmentSubmit">Submit Assignment</button>
        <button @click="showDetailedAssignmentInformation = false">Close</button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PlusIcon from '~/static/Icons/plus.svg?inline'
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
  data() {
    return {
      sortByOption: 'dueDate',
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
    ...mapState(['userAssignments', 'apiUrl', 'user', 'currentlyViewingClass']),
    isTeacher() {
      return this.currentlyViewingClass.createdBy._id === this.user._id
    },
    expiredAssignments() {
      const assignments = []
      this.userAssignments.forEach((assignment) => {
        if (
          moment(assignment.dueDate, 'YYYY-MM-DD').isSameOrBefore(
            moment().format('YYYY-MM-DD')
          )
        ) {
          assignments.push(assignment._id)
        }
      })
      return assignments
    },
  },
  methods: {
    sortByOptionChanged() {
      this.$store.dispatch('getUserAssignments', this.sortByOption)
      this.$router.push(`/app/assignments?sortBy=${this.sortByOption}`)
    },
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
    this.sortByOption = this.$route.query.sortBy || 'dueDate'
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
#assignments-page {
  width: 100%;
  min-height: 100vh;

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .sort-options-wrapper {
      select {
        margin-left: 8px;
      }
    }
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
          }
        }
      }
    }
  }
}
</style>
