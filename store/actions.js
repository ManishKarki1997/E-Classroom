import axios from 'axios';

const action = {
    login({ state, commit }, payload) {
        return axios.post(`${process.env.baseUrl}/api/user/login`, payload);
    },
    register({ state, commit }, payload) {
        return axios.post(`${process.env.baseUrl}/api/user`, payload);
    },
    fetchAllClasses({ state, commit }, payload) {
        return axios.get(`${process.env.baseUrl}/api/class`, {
            headers: {
                'Authorization': `Bearer ${state.jwtToken}`,
            }
        });
    },
    createNewClass({ state, commit }, payload) {
        return axios.post(`${process.env.baseUrl}/api/class`, payload, {
            headers: {
                'Authorization': `Bearer ${state.jwtToken}`,
            }
        });
    }

}

export default action;