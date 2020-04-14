import axios from '@/plugins/axios'

const Admin = {
  all: (query, token) => {
    return axios.get('/v1/admins' + query, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },

  delete: (param, token) => {
    return axios.delete('/v1/admins/' + param, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  saveFilter: (params, token) => {
    return axios.patch(
      '/v1/filters/admins?' + params.queries,
      {
        name: params.name
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  },
  deleteFilter: (id, token) => {
    return axios.delete('/v1/filters/' + id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  getFilters: token => {
    return axios.get('/v1/filters/admins?', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export default Admin
