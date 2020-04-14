import axios from '@/plugins/axios'

const UserService = {
  me: (token) => {
    return axios.get('/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  editMe: (params, token) => {
    return axios.put('/v1/admins', params, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  details: (param, token) => {
    return axios.get('/v1/admins/' + param, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  edit: (params, token) => {
    return axios.put('/v1/admins/' + params.id, params.data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  add: (params, token) => {
    return axios.post('/v1/admins/groups/' + params.id + '/users', params.data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  avatar: (params, token) => {
    const is_param = typeof params.id !== 'undefined' ? '/' + params.id : ''
    return axios.post('/v1/admins/avatar' + is_param, params.data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  password: (params, token) => {
    return axios.put('/v1/admins/reset', params, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
}

export default UserService