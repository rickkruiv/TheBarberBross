import api from "./api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const TIPO_OPTIONS = [
  { value: "SERVICO", label: "Serviço" },
  { value: "PRODUTO", label: "Produto" }
]

export function tipoToLabel(tipo) {
  if (!tipo) return ""
  const found = TIPO_OPTIONS.find(t => t.value === tipo)
  return found ? found.label : tipo
}

export async function fetchCategories() {
  const { data } = await api.get("/categorias")
  return data
}

export async function createCategory({ nome, tipo, descricao }) {
  const payload = {
    nome,
    descricao: descricao || "",
    tipo
  }
  const { data } = await api.post("/categorias", payload)
  return data
}

export async function updateCategory(id, { nome, tipo, descricao }) {
  const payload = {
    nome,
    descricao: descricao || "",
    tipo
  }
  const { data } = await api.patch(`/categorias/${id}`, payload)
  return data
}

export async function deleteCategory(id) {
  await api.delete(`/categorias/${id}`)
}

export const useCategories = (params) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => fetchCategories(params),
    staleTime: 30000
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    }
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }) => updateCategory(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    }
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    }
  })
}
