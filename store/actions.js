import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AdminActions from './admin/admin'
import ClassActions from './class/class'
import ResourceActions from './resource/resource'
import AssignmentActions from './assignment/assignment'

const action = {
  ...AdminActions,
  ...ClassActions,
  ...ResourceActions,
  ...AssignmentActions,

  logout({ state, commit }, payload) {
    this.$router.push('/login')
    setTimeout(() => {
      commit('logout')
    }, 500)
  },
  async login({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(`/user/login`, payload)
    if (response.data.error) {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'danger',
        dismissAfter: 3000,
      })
    } else {
      const { user, jwtToken } = response.data.payload
      dispatch(ADD_TOAST_MESSAGE, {
        text: 'Login successful. Redirecting...',
        type: 'success',
        dismissAfter: 1500,
      })
      commit('setUser', { user, jwtToken })
      setTimeout(() => {
        if (user.userType === 'ADMIN') this.$router.push('/app/admin/dashboard')
        else this.$router.push('/app/dashboard')
      }, 1500)
    }
  },
  async register({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(`/user/`, payload)

    if (response.data.error) {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'danger',
        dismissAfter: 3000,
      })
    } else {
      const { user, jwtToken } = response.data.payload
      dispatch(ADD_TOAST_MESSAGE, {
        text: 'Registered successfully. Redirecting...',
        type: 'success',
        dismissAfter: 1500,
      })
      commit('setUser', { user, jwtToken, isLoggedIn: true })
      setTimeout(() => {
        this.$router.push('/dashboard')
      }, 1500)
    }
  },
  async updateProfile({ state, commit, dispatch }, payload) {
    const response = await this.$axios.put(`/user`, payload, {
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
        text: 'Login successful. Redirecting...',
        type: 'success',
        dismissAfter: 1500,
      })
      dispatch('getUserDetails')
    }
  },
  async updateUserAvatar({ state, commit, dispatch }, payload) {
    const response = await this.$axios.put(`/user/avatar`, payload, {
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
      dispatch('getUserDetails')
    }
  },
  async requestPasswordReset({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(
      `/user/requestPasswordReset`,
      payload
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

      setTimeout(() => {
        this.$router.push('/login')
      }, 1000)
    }
  },

  async resetPassword({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(`/user/resetPassword`, payload)

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

      setTimeout(() => {
        this.$router.push('/login')
      }, 1500)
    }
  },

  async getUserDetails({ state, commit }, payload) {
    const response = await this.$axios.get(`/user/details`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })

    if (!response.data.error) {
      commit('setUser', { user: response.data.payload.user })
    }
  },
  async fetchNotifications({ state, commit }, payload) {
    const response = await this.$axios.get(`/notification/${state.user._id}`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
    if (!response.data.error) {
      commit('setUserNotifications', response.data.payload)
    }
  },

  // announcements
  async makeAnAnnouncement({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(`/announcement`, payload, {
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
      commit('setCurrentClassAnnouncements', response.data.payload.announcement)
    }
  },
  async fetchAnnouncements({ state, commit, dispatch }, classId) {
    const response = await this.$axios.get(`/announcement/class/${classId}`, {
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
      commit(
        'setCurrentClassAnnouncements',
        response.data.payload.announcements
      )
    }
  },

  // chat
  fetchClassChat({ state, commit }, payload) {
    return this.$axios.get(`/chat/${payload}`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
  },
}
export default action
