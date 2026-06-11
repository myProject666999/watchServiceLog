import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const watchAPI = {
  list: () => api.get('/watches'),
  get: (id) => api.get(`/watches/${id}`),
  create: (data) => api.post('/watches', data),
  update: (id, data) => api.put(`/watches/${id}`, data),
  delete: (id) => api.delete(`/watches/${id}`),
}

export const timekeepingAPI = {
  listByWatch: (watchId) => api.get(`/watches/${watchId}/timekeeping`),
  listByWatchRange: (watchId, start, end) =>
    api.get(`/watches/${watchId}/timekeeping/range`, { params: { start, end } }),
  create: (data) => api.post('/timekeeping', data),
  delete: (id) => api.delete(`/timekeeping/${id}`),
}

export const maintenanceAPI = {
  listByWatch: (watchId) => api.get(`/watches/${watchId}/maintenance`),
  create: (data) => api.post('/maintenance', data),
  update: (id, data) => api.put(`/maintenance/${id}`, data),
  delete: (id) => api.delete(`/maintenance/${id}`),
}

export const wearingAPI = {
  listByWatch: (watchId) => api.get(`/watches/${watchId}/wearing`),
  create: (data) => api.post('/wearing', data),
  delete: (id) => api.delete(`/wearing/${id}`),
}

export const dashboardAPI = {
  get: () => api.get('/dashboard'),
}

export default api
