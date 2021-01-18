import { ADD_TOAST_MESSAGE } from 'vuex-toast'

const resourceActions = {
  // fetch all resources for a user
  async fetchAllResources({ state, commit }, payload) {
    const response = await this.$axios.get(`/resourceFolder/allResources/`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })

    if (!response.data.error) {
      commit('setUserPersonalResources', response.data)
    }
  },
  // fetch all resource folders of a class
  async fetchClassFolderResources({ state, commit }, payload) {
    commit('setLoadingInfo', {
      loading: true,
      message: 'Fetching resources...',
    })
    const response = await this.$axios.get(
      `/resourceFolder/allResourceFolders/${payload}`,
      {
        headers: {
          Authorization: `Bearer ${state.jwtToken}`,
        },
      }
    )
    if (!response.data.error) {
      commit(
        'setCurrentClassResourceFolders',
        response.data.payload.classResourceFolders
      )
    }
    commit('resetLoadingInfo')
  },
  async addNewResourceDirectlyToFolder({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(
      `/resourceFolder/addNewResource`,
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
        text: response.data.payload.message,
        type: 'success',
        dismissAfter: 3000,
      })
      dispatch(
        'fetchClassFolderResources',
        response.data.payload.result.classId
      )
    }
  },
  async addNewResourceFolder({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(`/resourceFolder/`, payload, {
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
        text: 'Folder created successfully',
        type: 'success',
        dismissAfter: 3000,
      })
      dispatch('fetchClassFolderResources', payload.classId)
    }
  },

  // open a folder's contents
  async fetchFolderContents({ state, commit, dispatch }, payload) {
    const response = await this.$axios.get(
      `/resourceFolder/single/${payload}`,
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
      commit('setFolderContent', response.data.payload.folder)
    }
  },

  async addResourceToCollection({ state, commit, dispatch }, resourceId) {
    const response = await this.$axios.post(
      `/user/resources`,
      { resourceId },
      {
        headers: {
          Authorization: `Bearer ${state.jwtToken}`,
        },
      }
    )

    if (response.data.error) {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'warning',
        dismissAfter: 3000,
      })
    } else {
      dispatch(ADD_TOAST_MESSAGE, {
        text: response.data.message,
        type: 'success',
        dismissAfter: 3000,
      })
    }
  },

  async fetchUserResourceFolders({ state, commit, dispatch }, payload) {
    commit('setLoadingInfo', {
      loading: true,
      message: '',
    })
    const response = await this.$axios.get(`/resourceFolder/`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
    commit('resetLoadingInfo')

    if (response.data.error) {
      dispatch(ADD_TOAST_MESSAGE, {
        text: 'Something went wrong. Please refresh and try again.',
        type: 'danger',
        dismissAfter: 3000,
      })
    } else {
      commit(
        'setUserBookmarkedFolders',
        response.data.payload.userResourceFolders
      )
    }
  },

  async fetchUserSavedResources({ state, commit }, payload) {
    const response = await this.$axios.get(`/user/resources`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`,
      },
    })
    if (response.data.error) {
      return
    } else {
      commit(
        'setUserResourceFolders',
        response.data.payload.userResourceFolders
      )
    }
  },

  async bookmarkResource({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(
      `/resourceFolder/addResource`,
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
    }
  },
  async deleteResourceFromFolder({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(
      `/resourceFolder/deleteResource`,
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
      dispatch('fetchFolderContents', response.data.payload.savedFolder._id)
    }
  },
  async renameResourceFolder({ state, commit, dispatch }, payload) {
    const response = await this.$axios.put(`/resourceFolder/rename`, payload, {
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
      dispatch('fetchClassFolderResources', state.currentlyViewingClass._id)
    }
  },
  async deleteResourceFolder({ state, commit, dispatch }, payload) {
    const response = await this.$axios.delete(`/resourceFolder/${payload}`, {
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
      dispatch('fetchClassFolderResources', state.currentlyViewingClass._id)
    }
  },
  async copyFolder({ state, commit, dispatch }, payload) {
    const response = await this.$axios.post(
      `/resourceFolder/copyFolder`,
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
    }
  },
}

export default resourceActions
