import api from "./api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const listFornecedores = async () => {
  const { data } = await api.get("/fornecedores")
  return data
}

export const getFornecedor = async id => {
  const { data } = await api.get(`/fornecedores/${id}`)
  return data
}

export const createFornecedor = async payload => {
  const { data } = await api.post("/fornecedores", payload)
  return data
}

export const updateFornecedor = async (id, payload) => {
  const { data } = await api.put(`/fornecedores/${id}`, payload)
  return data
}

export const deleteFornecedor = async id => {
  await api.delete(`/fornecedores/${id}`)
}

export const useFornecedores = () => {
  return useQuery({
    queryKey: ["fornecedores"],
    queryFn: listFornecedores,
    staleTime: 300000
  })
}

export const useFornecedor = (id) => {
  return useQuery({
    queryKey: ["fornecedor", id],
    queryFn: () => getFornecedor(id),
    enabled: !!id,
    staleTime: 300000
  })
}

export const useCreateFornecedor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createFornecedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] })
    }
  })
}

export const useUpdateFornecedor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => updateFornecedor(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] })
      queryClient.invalidateQueries({ queryKey: ["fornecedor", variables.id] })
    }
  })
}

export const useDeleteFornecedor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteFornecedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] })
    }
  })
}
