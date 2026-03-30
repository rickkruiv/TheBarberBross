import api from "./api"
import { useQuery } from "@tanstack/react-query"

export async function fetchDashboard() {
  const { data } = await api.get("/dashboard")
  return data
}

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 60000
  })
}