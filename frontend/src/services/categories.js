import api from "./api"

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
  const { data } = await api.put(`/categorias/${id}`, payload)
  return data
}

export async function deleteCategory(id) {
  await api.delete(`/categorias/${id}`)
}
