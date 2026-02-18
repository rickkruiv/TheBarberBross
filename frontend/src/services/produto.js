import api from "./api"

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
