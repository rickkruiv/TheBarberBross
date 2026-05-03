import api from "./api";

type RegisterClienteDTO = {
  nome: string;
  email: string;
  senha: string;
};

export async function buscarClientePorId(id: string) {
  const response = await api.get(`/clientes/${id}`);
  return response.data;
}

export async function registrarCliente(data: RegisterClienteDTO) {
  const response = await api.post("/auth/registrar/cliente", data);
  return response.data;
}