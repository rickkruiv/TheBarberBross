import api from "./api";

export async function buscarClientePorId(id: string) {
  const response = await api.get(`/clientes/${id}`);
  return response.data;
}