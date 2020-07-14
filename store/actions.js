import axios from 'axios'

const action = {
  login({ state, commit }, payload) {
    return axios.post(`${process.env.baseUrl}/api/user/login`, payload)
  },
  getUserDetails({ state, commit }, payload) {
    return axios.get(`${process.env.baseUrl}/api/user/details`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  register({ state, commit }, payload) {
    return axios.post(`${process.env.baseUrl}/api/user`, payload)
  },
  fetchNotifications({ state, commit }, payload) {
    return axios.get(
      `${process.env.baseUrl}/api/notification/${state.user._id}`,
      {
        headers: {
          Authorization: `Bearer ${state.jwtToken}`
        }
      }
    )
  },
  fetchUpcomingClasses({ state, commit }, payload) {
    return axios.get(`${process.env.baseUrl}/api/class/upcoming`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  markNotificationAsRead({ state, commit }, payload) {
    return axios.post(
      `${process.env.baseUrl}/api/notification/read`,
      { notificationId: payload },
      {
        headers: {
          Authorization: `Bearer ${state.jwtToken}`
        }
      }
    )
  },
  fetchAllClasses({ state, commit }, payload) {
    return axios.get(`${process.env.baseUrl}/api/class`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  createNewClass({ state, commit }, payload) {
    return axios.post(`${process.env.baseUrl}/api/class`, payload, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  joinNewClass({ state, commit }, payload) {
    return axios.post(`${process.env.baseUrl}/api/class/join`, payload, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  leaveClass({ state, commit }, payload) {
    return axios.post(`${process.env.baseUrl}/api/class/leave`, payload, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },

  fetchClassUsers({ state, commit }, payload) {
    return axios.get(`${process.env.baseUrl}/api/class/${payload}/students`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  fetchUserClasses({ state, commit }, payload) {
    return axios.get(`${process.env.baseUrl}/api/user/classes`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  updateClass({ state, commit }, payload) {
    return axios.put(`${process.env.baseUrl}/api/class`, payload, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  fetchClassPendingRequests({ state, commit }, { classId }) {
    return axios.get(
      `${process.env.baseUrl}/api/class/pendingrequests/${classId}`,
      {
        headers: {
          Authorization: `Bearer ${state.jwtToken}`
        }
      }
    )
  },
  // class teacher accepts or rejects the request
  pendingRequestDecision({ state, commit }, payload) {
    return axios.post(
      `${process.env.baseUrl}/api/class/pendingrequests/accept`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${state.jwtToken}`
        }
      }
    )
  },
  fetchAllResources({ state, commit }, { classId }) {
    return axios.get(`${process.env.baseUrl}/api/resource/${classId}`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  addNewResource({ state, commit }, { newResource }) {
    return axios.post(`${process.env.baseUrl}/api/resource`, newResource, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  deleteResource({ state, commit }, payload) {
    return axios.delete(`${process.env.baseUrl}/api/resource`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      },
      data: {
        payload
      }
    })
  },
  fetchUserClassResources({ state, commit }, payload) {
    return axios.get(`${process.env.baseUrl}/api/resource/user/resources`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  // add resource to personal collection
  addResourceToCollection({ state, commit }, resourceId) {
    return axios.post(
      `${process.env.baseUrl}/api/user/resources`,
      { resourceId },
      {
        headers: {
          Authorization: `Bearer ${state.jwtToken}`
        }
      }
    )
  },

  fetchUserSavedResources({ state, commit }, payload) {
    return axios.get(`${process.env.baseUrl}/api/user/resources`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  updateUserDetails({ state, commit }, user) {
    return axios.put(`${process.env.baseUrl}/api/user`, user, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  updateUserAvatar({ state, commit }, payload) {
    return axios.put(`${process.env.baseUrl}/api/user/avatar`, payload, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  addNewVideoResource({ state, commit }, payload) {
    return axios.post(`${process.env.baseUrl}/api/video`, payload, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  fetchClassVideos({ state, commit }, payload) {
    return axios.get(`${process.env.baseUrl}/api/video/${payload}`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  deleteVideo({ state, commit }, payload) {
    return axios.delete(`${process.env.baseUrl}/api/video/${payload}`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  updateVideoDetail({ state, commit }, payload) {
    return axios.put(`${process.env.baseUrl}/api/video/`, payload, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  },
  fetchClassChat({ state, commit }, payload) {
    return axios.get(`${process.env.baseUrl}/api/chat/${payload}`, {
      headers: {
        Authorization: `Bearer ${state.jwtToken}`
      }
    })
  }
}

export default action
