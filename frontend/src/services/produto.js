import api from "./api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const listProdutos = async () => {
  const { data } = await api.get("/produtos")
  return data
}

export const getProduto = async id => {
  const { data } = await api.get(`/produtos/${id}`)
  return data
}

export const createProduto = async payload => {
  const { data } = await api.post("/produtos", payload)
  return data
}

export const updateProduto = async (id, payload) => {
  const { data } = await api.put(`/produtos/${id}`, payload)
  return data
}

export const deleteProduto = async id => {
  await api.delete(`/produtos/${id}`)
}

export const useProdutos = () => {
  return useQuery({
    queryKey: ["produtos"],
    queryFn: listProdutos,
    staleTime: 30000
  })
}

export const useProduto = (id) => {
  return useQuery({
    queryKey: ["produto", id],
    queryFn: () => getProduto(id),
    enabled: !!id,
    staleTime: 30000
  })
}

export const useCreateProduto = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProduto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] })
    }
  })
}

export const useUpdateProduto = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => updateProduto(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] })
      queryClient.invalidateQueries({ queryKey: ["produto", variables.id] })
    }
  })
}

export const useDeleteProduto = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProduto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] })
    }
  })
}
