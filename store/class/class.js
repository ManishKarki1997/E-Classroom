import { ADD_TOAST_MESSAGE } from 'vuex-toast'

const classActions = {
  async fetchAllClasses({ state, commit }, payload) {
    commit('setLoadingInfo', {
      loading: true,
      message: 'Fetching all classes...',
    })
    const response = await this.$axios.get(`/class/`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
    if (!response.data.error) {
      commit('setAllClasses', response.data.payload.classes)
    }
    commit('resetLoadingInfo')
  },
  async fetchUserClassesInDetail({ state, commit }, payload) {
    return this.$axios.get(`/class/detailed/${state.user._id}`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
  },

  async createNewClass({ state, commit, dispatch }, payload) {
    commit('setLoadingInfo', {
      loading: true,
      message: 'Creating the class...',
    })
    const response = await this.$axios.post(`/class`, payload, {
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
        text: 'Class created successfully.',
        type: 'success',
        dismissAfter: 3000,
      })
      setTimeout(() => {
        this.$router.go(-1)
      }, 3000)
    }
    commit('resetLoadingInfo')
  },

  async fetchClassPendingRequests({ state, commit }, classId) {
    commit('setLoadingInfo', {
      loading: true,
      message: 'Fetching pending requests...',
    })
    const response = await this.$axios.get(
      `/class/pendingrequests/${classId}`,
      {
        headers: {
          Authorization: `Bearer ${state.jwtToken}`,
        },
      }
    )
    if (!response.data.error) {
      commit(
        'setCurrentClassPendingRequests',
        response.data.payload.pendingJoinRequests
      )
    }
    commit('resetLoadingInfo')
  },

  // join new class
  async joinNewClass({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(`/class/join`, payload, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
    if (!response.data.error) {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'success',
        dismissAfter: 3000,
      })
      dispatch('fetchAllClasses')
    } else {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'danger',
        dismissAfter: 3000,
      })
    }
  },

  // leave a class
  async leaveClass({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(`/class/leave`, payload, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
    if (!response.data.error) {
      dispatch(ADD_TOAST_MESSAGE, {
        text: 'You have left the class.',
        type: 'success',
        dismissAfter: 3000,
      })
      dispatch('fetchAllClasses')
    } else {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'danger',
        dismissAfter: 3000,
      })
    }
  },

  // fetch a class' students
  async fetchClassStudents({ state, commit, dispatch }, classId) {
    const response = await this.$axios.get(`/class/${classId}/students`, {
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
      commit('setCurrentClassStudents', response.data.payload.users)
    }
  },

  // kickout student
  async kickoutStudent({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(`/class/kickout/`, payload, {
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
        dismissAfter: 3000,
      })
      dispatch('fetchClassStudents', payload.classId)
    }
  },

  // handle pending request
  async pendingRequestDecision({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(
      `/class/pendingrequests/accept`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${state.jwtToken}`,
        },
      }
    )

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
        dismissAfter: 3000,
      })
      commit('updateClassPendingRequest', payload.user)
    }
  },
}

export default classActions
