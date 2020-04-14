import axios from '@/plugins/axios'

const Upload = {
  uploadFile: (params, token) => {
    return axios.post('/v1/upload', params, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export default Upload
