import api from "./api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const { data } = await api.get("/servicos/empresa/1", config);
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

export const useServices = (params) => {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => fetchServices(params),
    staleTime: 30000
  });
};

export const useService = (id) => {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => fetchServiceById(id),
    enabled: !!id,
    staleTime: 30000
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    }
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }) => updateService(id, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["service", variables.id] });
    }
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    }
  });
};
