import axios from '@/plugins/axios'

const Client = {
  all: (query, token) => {
    return axios.get('/v1/clients' + query, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  details: (id, token) => {
    return axios.get('/v1/clients/' + id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  create: (params, token) => {
    console.log(params)
    return axios.post('/v1/clients', params, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  update: (params, token) => {
    return axios.put('/v1/clients/' + params.id, params, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  delete: (id, token) => {
    return axios.delete('/v1/clients/' + id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  saveFilter: (params, token) => {
    return axios.patch(
      '/v1/filters/clients?' + params.queries,
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
    return axios.get('/v1/filters/clients?', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  export: (params, token) => {
    return axios.get('/v1/clients?' + params.queries + '&export=' + params.type, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export default Client
