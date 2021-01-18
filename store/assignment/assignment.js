import { ADD_TOAST_MESSAGE } from 'vuex-toast'

const assignmentActions = {
  getUserAssignmentsForClass({ state, commit }, classId) {
    return this.$axios.get(`/assignment/class/${classId}`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
  },
  async getUserAssignments({ state, commit }, payload) {
    const sortByOption = payload || 'dueDate'
    const res = await this.$axios.get(
      `/assignment/user/${state.user._id}?sortBy=${sortByOption}`,
      {
        headers: {
          Authorization: `Bearer ${state.jwtToken}`,
        },
      }
    )
    if (!res.data.error) {
      commit('setUserAssignments', res.data.payload.assignments)
    }
  },
  getSingleAssignmentDetails({ state, commit }, assignmentId) {
    return this.$axios.get(`/assignment/${assignmentId}`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
  },
  getUserSubmittedAssignment({ state, commit }, assignmentId) {
    return this.$axios.get(`/assignment/submittedAssignment/${assignmentId}`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
  },
  deleteAssignment({ state, commit }, assignmentId) {
    return this.$axios.delete(`/assignment/${assignmentId}`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
  },

  async createAnAssignment({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(`/assignment`, payload, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
    if (response.data.error) {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'danger',
        dismissAfter: 3000,
      })
    } else {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'success',
        dismissAfter: 1500,
      })
    }
    return response
  },
  async submitAssignment({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(`/assignment/submit`, payload, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
    if (response.data.error) {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'danger',
        dismissAfter: 3000,
      })
    } else {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'success',
        dismissAfter: 1500,
      })
    }
    return response
  },
  async editAssignment({ state, commit, dispatch }, payload) {
    const response = await this.$axios.put(`/assignment`, payload, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
    if (response.data.error) {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'danger',
        dismissAfter: 3000,
      })
    } else {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'success',
        dismissAfter: 1500,
      })
    }
    return response
  },
  async makeAssignmentDecision({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(`/assignment/decision`, payload, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
    if (response.data.error) {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'danger',
        dismissAfter: 3000,
      })
    } else {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'success',
        dismissAfter: 1500,
      })
    }
    return response
  },

  async studentUpdateAssignment({ state, commit, dispatch }, payload) {
    const response = await this.$axios.put(`/assignment/submit`, payload, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
    if (response.data.error) {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'danger',
        dismissAfter: 3000,
      })
    } else {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'success',
        dismissAfter: 1500,
      })
    }
    return response
  },
}

export default assignmentActions
