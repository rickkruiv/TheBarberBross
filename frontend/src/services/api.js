import axios from "axios"
import { toastError } from "./toast"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.response.use(
  r => r,
  e => {
    toastError(e)
    return Promise.reject(e)
  }
)

export default api