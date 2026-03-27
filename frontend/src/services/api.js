import axios from "axios"
import { toastError } from "./toast"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@app:token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  r => r,
  e => {
    if (e.response && e.response.status === 401) {
      localStorage.removeItem("@app:token")
      localStorage.removeItem("@app:name")
      localStorage.removeItem("@app:userId")
      localStorage.removeItem("@app:nivelAcesso")
      window.location.href = "/login"
    } else {
      toastError(e)
    }
    return Promise.reject(e)
  }
)

export default api