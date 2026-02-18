import api from "./api"

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
