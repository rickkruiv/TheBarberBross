import React, { useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem
} from "@mui/material";
import ContentCut from "@mui/icons-material/ContentCut";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import AccessTime from "@mui/icons-material/AccessTime";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SectionCard from "../../components/SectionCard/SectionCard";
import CurrencyField from "../../components/CurrencyField/CurrencyField";
import ActionBar from "../../components/ActionBar/ActionBar";
import { toastSuccess, toastError } from "../../services/toast";
import {
  createService,
  updateService,
  fetchServiceById
} from "../../services/services";
import { fetchCategories } from "../../services/categories";

function isValidCurrencyBRL(value) {
  if (!value) return false;
  const digits = value.toString().replace(/[^\d]/g, "");
  if (!digits) return false;
  const n = Number(digits) / 100;
  if (Number.isNaN(n)) return false;
  return n >= 0;
}

const schema = Yup.object().shape({
  nome: Yup.string().required("Nome do serviço é obrigatório"),
  descricao: Yup.string().max(100, "Máximo de 100 caracteres"),
  categoriaId: Yup.number().required("Categoria é obrigatória"),
  preco: Yup.string()
    .required("Valor é obrigatório")
    .test("preco-valido", "Valor inválido", (value) => isValidCurrencyBRL(value)),
  tempoHoras: Yup.number().min(0, "Horas inválidas").integer("Use apenas números inteiros"),
  tempoMinutos: Yup.number()
    .min(0, "Minutos inválidos")
    .max(59, "Máximo de 59 minutos")
    .integer("Use apenas números inteiros"),
  intervaloAtendimento: Yup.number().min(0, "Intervalo inválido").integer("Use apenas números inteiros")
});

const defaultInitialValues = {
  nome: "",
  descricao: "",
  categoriaId: "",
  status: "ATIVO",
  preco: "",
  desconto: 0,
  tempoHoras: 0,
  tempoMinutos: 0,
  intervaloAtendimento: 15
};

const ServiceCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
  });

  const { data: serviceData } = useQuery({
    queryKey: ["service", id],
    queryFn: () => fetchServiceById(id),
    enabled: isEdit
  });

  const initialValues = useMemo(() => {
    if (!isEdit || !serviceData) return defaultInitialValues;

    const duracao = serviceData.duracao || 0;
    const tempoHoras = Math.floor(duracao / 60);
    const tempoMinutos = duracao % 60;

    return {
      nome: serviceData.nome || "",
      descricao: serviceData.descricao || "",
      categoriaId:
        serviceData.categoria?.categoriaId ||
        serviceData.categoria?.id ||
        "",
      status: serviceData.status || "ATIVO",
      preco: serviceData.preco != null ? String(serviceData.preco) : "",
      desconto: 0,
      tempoHoras,
      tempoMinutos,
      intervaloAtendimento: 15
    };
  }, [isEdit, serviceData]);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEdit) {
        await updateService(id, values);
        toastSuccess("Serviço atualizado com sucesso");
      } else {
        await createService(values);
        toastSuccess("Serviço criado com sucesso");
      }
      navigate("/servicos/visualizar");
    } catch (error) {
      toastError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Box width="100%" maxWidth={1100}>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={schema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            setFieldValue,
            handleSubmit: formikSubmit
          }) => (
            <Form>
              <Box display="flex" flexDirection="column" gap={3}>
                <SectionCard
                  icon={<ContentCut />}
                  title={isEdit ? "Editar Serviço" : "Informações do Serviço"}
                >
                  <Box display="flex" flexDirection="column" gap={3}>
                    <Box>
                      <Typography variant="subtitle2" mb={1}>
                        Nome do Serviço
                      </Typography>
                      <TextField
                        fullWidth
                        name="nome"
                        placeholder="Ex: Corte Masculino"
                        value={values.nome}
                        onChange={handleChange}
                        error={touched.nome && Boolean(errors.nome)}
                        helperText={touched.nome && errors.nome}
                      />
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" mb={1}>
                        Descrição
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        name="descricao"
                        placeholder="Descreva os detalhes do serviço..."
                        value={values.descricao}
                        onChange={handleChange}
                        error={touched.descricao && Boolean(errors.descricao)}
                        helperText={touched.descricao && errors.descricao}
                      />
                    </Box>

                    <Box
                      display="grid"
                      gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                      columnGap={3}
                      rowGap={3}
                    >
                      <Box>
                        <Typography variant="subtitle2" mb={1}>
                          Categoria
                        </Typography>
                        <TextField
                          select
                          fullWidth
                          name="categoriaId"
                          placeholder="Selecione uma categoria"
                          value={values.categoriaId}
                          onChange={handleChange}
                          error={touched.categoriaId && Boolean(errors.categoriaId)}
                          helperText={touched.categoriaId && errors.categoriaId}
                        >
                          {categories.map((categoria) => (
                            <MenuItem
                              key={categoria.id || categoria.categoriaId}
                              value={categoria.id || categoria.categoriaId}
                            >
                              {categoria.nome || categoria.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" mb={1}>
                          Status
                        </Typography>
                        <TextField
                          select
                          fullWidth
                          name="status"
                          value={values.status}
                          onChange={handleChange}
                        >
                          <MenuItem value="ATIVO">Ativo</MenuItem>
                          <MenuItem value="INATIVO">Inativo</MenuItem>
                        </TextField>
                      </Box>
                    </Box>
                  </Box>
                </SectionCard>

                <Box
                  display="flex"
                  flexDirection={{ xs: "column", md: "row" }}
                  gap={3}
                  alignItems="stretch"
                >
                  <Box flex={1}>
                    <SectionCard icon={<PaidOutlined />} title="Preço">
                      <Box display="flex" flexDirection="column" gap={3}>
                        <Box>
                          <Typography variant="subtitle2" mb={1}>
                            Valor do Serviço
                          </Typography>
                          <CurrencyField
                            fullWidth
                            name="preco"
                            value={values.preco}
                            onChange={(value) => setFieldValue("preco", value)}
                            error={touched.preco && Boolean(errors.preco)}
                            helperText={touched.preco && errors.preco}
                          />
                        </Box>

                        <Box>
                          <Typography variant="subtitle2" mb={1}>
                            Desconto (%)
                          </Typography>
                          <TextField
                            fullWidth
                            type="number"
                            name="desconto"
                            value={values.desconto}
                            onChange={handleChange}
                          />
                        </Box>
                      </Box>
                    </SectionCard>
                  </Box>

                  <Box flex={1}>
                    <SectionCard icon={<AccessTime />} title="Duração">
                      <Box display="flex" flexDirection="column" gap={3}>
                        <Box>
                          <Typography variant="subtitle2" mb={1}>
                            Tempo de Execução
                          </Typography>
                          <Box
                            display="grid"
                            gridTemplateColumns="1fr 1fr"
                            columnGap={2}
                            rowGap={2}
                          >
                            <TextField
                              fullWidth
                              type="number"
                              name="tempoHoras"
                              label="Horas"
                              value={values.tempoHoras}
                              onChange={handleChange}
                              error={touched.tempoHoras && Boolean(errors.tempoHoras)}
                              helperText={touched.tempoHoras && errors.tempoHoras}
                            />
                            <TextField
                              fullWidth
                              type="number"
                              name="tempoMinutos"
                              label="Minutos"
                              value={values.tempoMinutos}
                              onChange={handleChange}
                              error={touched.tempoMinutos && Boolean(errors.tempoMinutos)}
                              helperText={touched.tempoMinutos && errors.tempoMinutos}
                            />
                          </Box>
                        </Box>

                        <Box>
                          <Typography variant="subtitle2" mb={1}>
                            Intervalo entre atendimentos (min)
                          </Typography>
                          <TextField
                            fullWidth
                            type="number"
                            name="intervaloAtendimento"
                            value={values.intervaloAtendimento}
                            onChange={handleChange}
                            error={
                              touched.intervaloAtendimento &&
                              Boolean(errors.intervaloAtendimento)
                            }
                            helperText={
                              touched.intervaloAtendimento && errors.intervaloAtendimento
                            }
                          />
                        </Box>
                      </Box>
                    </SectionCard>
                  </Box>
                </Box>

                <ActionBar
                  onSubmit={formikSubmit}
                  onCancel={() => navigate("/servicos/visualizar")}
                  onPreview={() => {}}
                />
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ServiceCreate;
