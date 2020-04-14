import axios from '@/plugins/axios'

const AdminGroup = {
  all: (query, token) => {

    const is_query = typeof query !== 'undefined' ? query : ''    

    return axios.get('/v1/admins/groups' + is_query, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  permissions: (token) => {
    return axios.get('/v1/admins/permissions', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  details: (param, token) => {
    return axios.get('/v1/admins/groups/' + param, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  update: (params, token) => {
    return axios.put('/v1/admins/groups/' + params.id, params.data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  add: (data, token) => {
    return axios.post('/v1/admins/groups', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  // no request
  /* remove: (param, token) => {
    return axios.delete('/v1/admins/groups/' + param, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }, */
  saveToGroup: (params, token) => {
    return axios.put('/v1/admins/groups/' + params.group + '/users/' + params.user, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export default AdminGroup
