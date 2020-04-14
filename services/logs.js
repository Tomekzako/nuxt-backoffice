import axios from '@/plugins/axios'

const Logs = {
  all: (query, token) => {
    return axios.get('/v1/logs' + query, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  saveFilter: (params, token) => {
    return axios.patch(
      '/v1/filters/logs?' + params.queries,
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
    return axios.get('/v1/filters/logs?', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  export: (params, token) => {
    return axios.get('/v1/logs?' + params.queries + '&export=' + params.type, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export default Logs
