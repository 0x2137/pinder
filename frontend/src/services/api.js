import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let subscribers = []

function onAccessTokenFetched(token) {
  subscribers.forEach(callback => callback(token))
  subscribers = []
}

function addSubscriber(callback) {
  subscribers.push(callback)
}

api.interceptors.response.use(
  response => response,
  error => {
    const { config, response } = error
    if (response && response.status === 401 && !config._retry) {
      if (!isRefreshing) {
        isRefreshing = true
        return axios
          .post(
            'http://localhost:3000/api/auth/refresh',
            {},
            { withCredentials: true }
          )
          .then(res => {
            const newToken = res.data.data.accessToken
            localStorage.setItem('accessToken', newToken)
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
            onAccessTokenFetched(newToken)
            isRefreshing = false
            config._retry = true
            return api(config)
          })
          .catch(err => {
            isRefreshing = false
            subscribers = []
            localStorage.removeItem('accessToken')
            window.location.href = '/login'
            return Promise.reject(err)
          })
      }
      return new Promise(resolve => {
        addSubscriber(token => {
          config.headers.Authorization = `Bearer ${token}`
          resolve(api(config))
        })
      })
    }
    return Promise.reject(error)
  }
)

export default api
