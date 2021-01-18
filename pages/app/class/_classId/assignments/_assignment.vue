<template>
  <div id="single-assignment-page">
    <div class="top--header">
      <div class="assignment-detail-wrapper" v-if="assignment">
        <p>Assignment</p>
        <div class="assignment-info">
          <h3>{{ assignment.title }}</h3>
          <div
            class="info-icon-wrapper"
            v-tooltip.top-start="{
              content: 'View Assignment Info',
              classes: ['info'],
            }"
          >
            <InfoIcon @click="viewAssignmentInfo" />
          </div>
        </div>
        <p class="subtitle">Due date {{ assignment.dueDate | formatDate }}</p>
      </div>

      <div class="assignment-filter-wrapper" v-if="isTeacher">
        <button
          @click="activeFilterTab = 'submittedBy'"
          :class="{ activeTab: activeFilterTab === 'submittedBy' }"
        >
          Submitted
          <span class="length-wrapper">
            <span v-if="assignment.submittedBy">
              {{
              assignment.submittedBy.length
              }}
            </span>
          </span>
        </button>
        <button
          @click="activeFilterTab = 'yetToBeSubmittedBy'"
          :class="{ activeTab: activeFilterTab === 'yetToBeSubmittedBy' }"
        >
          Not Submitted
          <span class="length-wrapper">
            <span v-if="assignment.yetToBeSubmittedBy">
              {{
              assignment.yetToBeSubmittedBy.length
              }}
            </span>
          </span>
        </button>
        <button
          @click="activeFilterTab = 'approved'"
          :class="{ activeTab: activeFilterTab === 'approved' }"
        >
          Approved
          <span class="length-wrapper">
            <span v-if="assignment.approved">
              {{
              assignment.approved.length
              }}
            </span>
          </span>
        </button>
        <button
          @click="activeFilterTab = 'rejected'"
          :class="{ activeTab: activeFilterTab === 'rejected' }"
        >
          Rejected
          <span class="length-wrapper">
            <span v-if="assignment.rejected">
              {{
              assignment.rejected.length
              }}
            </span>
          </span>
        </button>
      </div>

      <div class="student-submit-assignment-button">
        <button v-if="!mySubmittedAssignment" @click="handleAssignmentSubmission">Submit Assignment</button>
      </div>
    </div>

    <div class="user-submitted-assignments" v-if="isTeacher">
      <div
        class="user-assignment-wrapper"
        v-if="
          assignment[activeFilterTab] && assignment[activeFilterTab].length > 0
        "
      >
        <div
          class="user-assignment"
          v-for="userAssignment in assignment[activeFilterTab]"
          :key="userAssignment._id"
        >
          <div class="user-avatar-wrapper">
            <img
              v-if="activeFilterTab === 'yetToBeSubmittedBy'"
              :src="apiUrl + '/uploads/images/' + userAssignment.avatar"
              alt="User Avatar"
            />
            <img
              v-else
              :src="apiUrl + '/uploads/images/' + userAssignment.userId.avatar"
              alt="User Avatar"
            />
          </div>
          <div class="user-assignment-details">
            <h3 v-if="activeFilterTab === 'yetToBeSubmittedBy'">{{ userAssignment.name }}</h3>
            <h3 v-else>{{ userAssignment.userId.name }}</h3>

            <p v-html="userAssignment.note"></p>
            <button
              @click="viewSubmittedFile(userAssignment)"
              v-if="activeFilterTab === 'submittedBy'"
            >View File</button>
          </div>
          <div class="more-options-icon-wrapper" v-if="isTeacher">
            <MoreHorizontalIcon @click.prevent="openContextMenu(userAssignment)" />
          </div>
        </div>
      </div>
      <div style="padding: 1rem;" v-else>
        <p>Nothing here</p>
      </div>
    </div>

    <div v-if="!isTeacher" class="user-submitted-assignments">
      <div class="my-submitted-assignment" v-if="mySubmittedAssignment">
        <div
          class="user-assignment"
          :class="{
            assignmentRejected: !isTeacher && isMyAssignmentRejected,
            assignmentAccepted: !isTeacher && isMyAssignmentAccepted,
          }"
        >
          <div class="user-avatar-wrapper">
            <img :src="apiUrl + '/uploads/images/' + user.avatar" alt="User Avatar" />
          </div>
          <div class="user-assignment-details">
            <h3>{{ user.name }}</h3>
            <p v-html="mySubmittedAssignment.note"></p>
            <button @click="viewSubmittedFile(mySubmittedAssignment)">View File</button>
          </div>
          <div class="more-options-icon-wrapper" v-if="!isTeacher">
            <MoreHorizontalIcon
              @click.prevent="
                openStudentAssignmentContextMenu(mySubmittedAssignment)
              "
            />
          </div>
        </div>
      </div>
    </div>

    <Modal
      v-if="showRejectAssignmentModal"
      class="reject-assignment-modal"
      @closeModal="closeRejectAssignmentModal"
    >
      <template slot="header">
        <h4>Reject assignment</h4>
      </template>

      <template slot="body">
        <form @submit.prevent="makeAssignmentDecision('REJECT')">
          <div class="reject-modal-user-detail">
            <img
              :src="
                apiUrl +
                '/uploads/images/' +
                selectedUserAssignment.userId.avatar
              "
              alt="User Avatar"
            />
            <h4>{{ selectedUserAssignment.userId.name }}</h4>
          </div>

          <div class="form-input">
            <quill-editor
              class="quill-editor"
              ref="editor"
              v-model="assignmentRejectionReason"
              :options="editorOption"
            />
          </div>

          <div class="form-buttons">
            <button type="submit">Reject Assignment</button>
            <button @click="closeRejectAssignmentModal">Cancel</button>
          </div>
        </form>
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

    <Modal
      v-if="showStudentEditAssignmentModal"
      class="submit-assignment-modal"
      @closeModal="showStudentEditAssignmentModal = false"
    >
      <template slot="header">
        <h4>Uupdate assignment</h4>
      </template>

      <template slot="body">
        <form @submit.prevent="studentEditAssignment">
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
            <button type="submit">Update</button>
            <button @click="showStudentEditAssignmentModal = false">Cancel</button>
          </div>
        </form>
      </template>
    </Modal>

    <Modal
      v-if="showViewAssignmentInfoModal"
      class="submit-assignment-modal"
      @closeModal="showViewAssignmentInfoModal = false"
    >
      <template slot="header">
        <h4>{{ currentlyViewingClass.name }}</h4>
      </template>

      <template slot="body">
        <h4>{{ assignment.title }}</h4>
        <div v-html="assignment.description"></div>
      </template>

      <template slot="footer">
        <button type="submit" @click="handleAssignmentSubmission">Submit Assignment</button>
        <button @click="showViewAssignmentInfoModal = false">Close</button>
      </template>
    </Modal>

    <context-menu
      class="context-menu user-assignment-option-context-menu"
      ref="userAssignmentOptionContextMenu"
    >
      <li
        v-if="
          activeFilterTab !== 'approved' ||
          activeFilterTab !== 'notYetSubmittedBy'
        "
        @click="makeAssignmentDecision('APPROVE')"
      >Approve</li>
      <li v-if="activeFilterTab === 'submittedBy'" @click="handleAssignmentRejection">Reject</li>
    </context-menu>

    <context-menu
      class="context-menu my-assignment-option-context-menu"
      ref="myAssignmentOptionContextMenu"
    >
      <li v-if="!isTeacher" @click="handleStudentEditAssignment">Edit</li>
    </context-menu>

    <v-dialog />
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import InfoIcon from '~/static/Icons/info.svg?inline'
import MoreHorizontalIcon from '~/static/Icons/more-horizontal.svg?inline'
import contextMenu from 'vue-context-menu'
import Modal from '~/components/Modal'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  components: {
    InfoIcon,
    MoreHorizontalIcon,
    contextMenu,
    Modal,
  },
  computed: {
    ...mapGetters([
      'user',
      'apiUrl',
      'currentlyViewingClass',
      // 'currentClassAssignments',
    ]),
    isTeacher() {
      return this.currentlyViewingClass.createdBy._id === this.user._id
    },

    isMyAssignmentRejected() {
      const value = this.assignment.rejected.find(
        (a) => a.userId._id === this.user._id
      )
      return value !== undefined
    },
    isMyAssignmentAccepted() {
      const value = this.assignment.approved.find(
        (a) => a.userId._id === this.user._id
      )
      return value !== undefined
    },
  },
  data() {
    return {
      assignment: [],
      activeFilterTab: 'submittedBy',
      editorOption: {
        theme: 'snow',
        placeholder: 'Rejection Reason',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
          ],
        },
      },
      mySubmittedAssignment: null,
      selectedUserAssignment: null,
      assignmentRejectionReason: '',
      showRejectAssignmentModal: false,
      showSubmitAssignmentModal: false,
      showViewAssignmentInfoModal: false,
      showStudentEditAssignmentModal: false,
      toBeSubmittedAssignment: {
        note: '',
        userId: '',
        assignmentId: '',
        assignmentFile: null,
      },
    }
  },
  methods: {
    viewAssignmentInfo() {
      this.showViewAssignmentInfoModal = true
    },
    assignmentFileSelected(e) {
      this.toBeSubmittedAssignment.assignmentFile = e.target.files[0]
    },
    handleAssignmentSubmission() {
      this.showViewAssignmentInfoModal = false
      this.showSubmitAssignmentModal = true
      this.editorOption.placeholder = 'A short note about the assignment'
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
      formData.append('assignmentId', this.$route.params.assignment)
      formData.append(
        'assignmentFile',
        this.toBeSubmittedAssignment.assignmentFile
      )
      formData.append('note', this.toBeSubmittedAssignment.note)

      const res = await this.$store.dispatch('submitAssignment', formData)
      this.toBeSubmittedAssignment.assignmentFile = ''
      this.showSubmitAssignmentModal = false
      this.toBeSubmittedAssignment.note = ''
    },
    async fetchAssignmentDetails() {
      const res = await this.$store.dispatch(
        'getSingleAssignmentDetails',
        this.$route.params.assignment
      )
      this.assignment = res.data.payload.assignment
    },
    viewSubmittedFile(userAssignment) {
      window.open(
        `${this.apiUrl}/uploads/assignments/${userAssignment.assignmentFileName}`,
        '_target'
      )
    },
    openContextMenu(userAssignment) {
      this.selectedUserAssignment = userAssignment
      this.$refs.userAssignmentOptionContextMenu.open()
    },
    async makeAssignmentDecision(decision) {
      const payload = {
        decision,
        assignmentId: this.$route.params.assignment,
        userAssignmentId: this.selectedUserAssignment._id,
        userId: this.user._id,
      }
      const response = await this.$store.dispatch(
        'makeAssignmentDecision',
        payload
      )
      if (!response.data.error) {
        this.fetchAssignmentDetails()
        this.showRejectAssignmentModal = false
      }
    },
    async handleAssignmentRejection() {
      this.$modal.show('dialog', {
        title: 'Reject Assignment',
        text: 'Are you sure you want to reject the assignment?',
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
              this.$modal.hide('dialog')
              this.showRejectAssignmentModal = true
            },
          },
        ],
      })
    },
    closeRejectAssignmentModal() {
      this.showRejectAssignmentModal = false
      this.selectedUserAssignment = null
    },
    async fetchStudentSubmittedAssignment() {
      const res = await this.$store.dispatch(
        'getUserSubmittedAssignment',
        this.$route.params.assignment
      )
      this.mySubmittedAssignment = res.data.payload.userAssignment
    },
    openStudentAssignmentContextMenu(mySubmittedAssignment) {
      this.$refs.myAssignmentOptionContextMenu.open()
    },
    handleStudentEditAssignment() {
      this.showStudentEditAssignmentModal = true
      this.toBeSubmittedAssignment.note = this.mySubmittedAssignment.note
      this.toBeSubmittedAssignment.assignmentFileName = this.mySubmittedAssignment.assignmentFileName
    },
    async studentEditAssignment() {
      if (this.toBeSubmittedAssignment.assignmentFileName == null) {
        this.$store.dispatch(ADD_TOAST_MESSAGE, {
          text: 'Please select the assignment file to submit.',
          type: 'danger',
          dismissAfter: 3000,
        })
        return
      }

      const formData = new FormData()
      formData.append('userId', this.user._id)
      formData.append('assignmentId', this.$route.params.assignment)
      formData.append(
        'assignmentFile',
        this.toBeSubmittedAssignment.assignmentFile
          ? this.toBeSubmittedAssignment.assignmentFile
          : null
      )
      formData.append('note', this.toBeSubmittedAssignment.note)
      formData.append('userAssignmentId', this.mySubmittedAssignment._id)

      const res = await this.$store.dispatch(
        'studentUpdateAssignment',
        formData
      )

      if (!res.data.error) {
        this.fetchStudentSubmittedAssignment()
        this.showStudentEditAssignmentModal = false
        this.toBeSubmittedAssignment.assignmentFile = null
        this.toBeSubmittedAssignment.note = ''
      }
    },
  },
  mounted() {
    this.fetchAssignmentDetails()
    if (!this.isTeacher) {
      this.fetchStudentSubmittedAssignment()
    }
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
#single-assignment-page {
  .top--header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    padding: 1rem;

    .assignment-detail-wrapper {
      max-width: 40%;

      .assignment-info {
        display: flex;
        align-items: center;
        justify-content: space-between;

        h3 {
          width: 90%;
          margin: 8px 0;
        }
        .info-icon-wrapper {
          margin-left: 1rem;
          svg {
            width: 20px;
            height: 20px;
            stroke: var(--primary-font-color);
          }
        }
      }
    }

    .assignment-filter-wrapper {
      button {
        @include tertiaryButton;
        margin-left: 1rem;
        transition: all 0.3s ease-in-out;
        outline: none;

        &.activeTab {
          color: var(--accent-background-color);

          span.length-wrapper {
            background-color: var(--accent-background-color);
            span {
              color: var(--opposite-font-color);
            }
          }
        }

        span.length-wrapper {
          border: 1px solid var(--accent-background-color);
          padding: 2px 8px;
          border-radius: 50%;
          font-size: 14px;
        }
      }
    }
  }

  .user-submitted-assignments {
    .user-assignment-wrapper,
    .my-submitted-assignment {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-gap: 2rem;
      padding: 1rem;

      .user-assignment {
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

        &.assignmentRejected {
          border: 2px solid lightcoral;
        }

        &.assignmentAccepted {
          border: 2px solid lightgreen;
        }

        .more-options-icon-wrapper {
          display: none;
          position: absolute;
          top: 8px;
          right: 8px;
        }

        .user-avatar-wrapper {
          width: 60px;
          overflow: hidden;
          margin-right: 8px;
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }

        .user-assignment-details {
          p {
            margin: 8px 0;
          }
          button {
            @include tertiaryButton;
          }
        }
      }
    }
  }
  .student-submit-assignment-button {
    button {
      @include primaryButton;
      transition: all 0.3s ease-in-out;
      &:hover {
        background-color: var(--button-background-hover);
      }
    }
  }

  .reject-assignment-modal,
  .submit-assignment-modal {
    .reject-modal-user-detail {
      display: flex;
      align-items: center;
      margin-bottom: 2rem;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 8px;
      }
    }
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
