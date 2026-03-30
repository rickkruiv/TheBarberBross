import api from "./api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export async function fetchSocialMedias() {
  const { data } = await api.get("/socialmedias")
  return data
}

export async function upsertSocialMedia({ id, url, empresaId }) {
  if (id) {
    const { data } = await api.put(`/socialmedias/${id}`, {
      socialMediaId: id,
      url,
      empresaId
    })
    return data
  }

  const { data } = await api.post("/socialmedias", {
    url,
    empresaId
  })
  return data
}

export async function deleteSocialMedia(id) {
  await api.delete(`/socialmedias/${id}`)
}

export const useSocialMedias = () => {
  return useQuery({
    queryKey: ["socialMedias"],
    queryFn: fetchSocialMedias,
    staleTime: 300000
  })
}

export const useUpsertSocialMedia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: upsertSocialMedia,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["socialMedias"] })
  })
}

export const useDeleteSocialMedia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSocialMedia,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["socialMedias"] })
  })
}
