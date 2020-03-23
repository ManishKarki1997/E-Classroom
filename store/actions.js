import axios from 'axios';

const action = {
    login({ state, commit }, payload) {
        return axios.post(`${process.env.baseUrl}/api/user/login`, payload);
    },
    register({ state, commit }, payload) {
        return axios.post(`${process.env.baseUrl}/api/user`, payload);
    }
}

export default action;