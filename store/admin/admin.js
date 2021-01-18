import { ADD_TOAST_MESSAGE } from 'vuex-toast'

const adminActions = {
  getAdminDashboardMetaInfo({ state, commit }, payload) {
    return this.$axios.get(`/user/admin/dashboardMetaInfo`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
  },
  getAllUsersForAdmin({ state, commit }, payload) {
    return this.$axios.get(`/user/admin/users`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
  },
  getAllClassFoldersForAdmin({ state, commit }, payload) {
    return this.$axios.get(`/user/admin/classResourceFolders`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
  },
  async kickoutUser({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(`/user/admin/kickout`, payload, {
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
      dispatch('getAllUsersForAdmin')
    }
  },

  async makeClassPublicOrPrivate({ state, commit, dispatch }, payload) {
    const response = await this.$axios.put(
      `/user/admin/makeClassPrivate`,
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
        dismissAfter: 1500,
      })
      dispatch('fetchAllClasses')
    }
  },
}

export default adminActions
