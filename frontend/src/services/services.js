import api from "./api";

function parseCurrencyBRL(value) {
  if (!value) return 0;
  const digits = value.toString().replace(/[^\d]/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
}

function buildPayload(values) {
  const horas = Number(values.tempoHoras ?? values.horas ?? 0);
  const minutos = Number(values.tempoMinutos ?? values.minutos ?? 0);
  const duracao = horas * 60 + minutos;

  return {
    nome: values.nome,
    descricao: values.descricao || "",
    preco: parseCurrencyBRL(values.preco),
    duracao,
    categoria: values.categoriaId ? { categoriaId: Number(values.categoriaId) } : null
  };
}

export async function createService(values) {
  const payload = buildPayload(values);
  const { data } = await api.post("/servicos", payload);
  return data;
}

export async function fetchServices(params) {
  const config = params ? { params } : undefined;
  const { data } = await api.get("/servicos", config);
  return data;
}

export async function fetchServiceById(id) {
  const { data } = await api.get(`/servicos/${id}`);
  return data;
}

export async function updateService(id, values) {
  const payload = buildPayload(values);
  const { data } = await api.put(`/servicos/${id}`, payload);
  return data;
}

export async function deleteService(id) {
  await api.delete(`/servicos/${id}`);
}
