import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@app:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;