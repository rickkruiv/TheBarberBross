import React, { useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button
} from "@mui/material";
import ContentCut from "@mui/icons-material/ContentCut";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import AccessTime from "@mui/icons-material/AccessTime";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SectionCard from "../../shared/SectionCard/SectionCard";
import CurrencyField from "../../components/CurrencyField/CurrencyField";
import ActionBar from "../../components/ActionBar/ActionBar";
import { toastSuccess, toastError } from "../../services/toast";
import {
  useCreateService,
  useUpdateService,
  useService
} from "../../services/services";
import { useCategories } from "../../services/categories";

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
    .integer("Use apenas números inteiros")
});

const defaultInitialValues = {
  nome: "",
  descricao: "",
  categoriaId: "",
  preco: "",
  tempoHoras: 0,
  tempoMinutos: 0
};

const ServiceCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEditMode = location.pathname.endsWith("/editar");
  const isView = Boolean(id) && !isEditMode;
  const isEdit = Boolean(id) && isEditMode;

  const { data: categoriasData } = useCategories();
  const categoriesList = Array.isArray(categoriasData)
    ? categoriasData
    : categoriasData?.data || [];
  const categoriasServico = categoriesList.filter(c => c.tipo === "SERVICO");

  const { data: serviceData } = useService(id);
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();

  const initialValues = useMemo(() => {
    if (!isEdit || !serviceData) return defaultInitialValues;

    const duracao = serviceData.duracao || 0;
    const tempoHoras = Math.floor(duracao / 60);
    const tempoMinutos = duracao % 60;

    return {
      nome: serviceData.nome || "",
      descricao: serviceData.descricao || "",
      categoriaId: serviceData.categoriaId || "",
      preco: serviceData.preco != null ? String(serviceData.preco) : "",
      tempoHoras,
      tempoMinutos
    };
  }, [isEdit, serviceData]);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id, values });
        toastSuccess("Serviço atualizado com sucesso");
      } else {
        await createMutation.mutateAsync(values);
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
                  title={isView ? "Visualizar Serviço" : isEdit ? "Editar Serviço" : "Informações do Serviço"}
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
                        disabled={isView}
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
                        disabled={isView}
                        error={touched.descricao && Boolean(errors.descricao)}
                        helperText={touched.descricao && errors.descricao}
                      />
                    </Box>

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
                        disabled={isView}
                        error={touched.categoriaId && Boolean(errors.categoriaId)}
                        helperText={touched.categoriaId && errors.categoriaId}
                      >
                        {categoriasServico.map((categoria) => (
                          <MenuItem
                            key={categoria.id || categoria.categoriaId}
                            value={categoria.id || categoria.categoriaId}
                          >
                            {categoria.nome || categoria.name}
                          </MenuItem>
                        ))}
                      </TextField>
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
                            disabled={isView}
                            error={touched.preco && Boolean(errors.preco)}
                            helperText={touched.preco && errors.preco}
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
                              disabled={isView}
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
                              disabled={isView}
                              error={touched.tempoMinutos && Boolean(errors.tempoMinutos)}
                              helperText={touched.tempoMinutos && errors.tempoMinutos}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </SectionCard>
                  </Box>
                </Box>

                {!isView ? (
                  <ActionBar
                    onSubmit={formikSubmit}
                    onCancel={() => navigate("/servicos/visualizar")}
                    onPreview={() => { }}
                  />
                ) : (
                  <Box display="flex" justifyContent="flex-end" mt={2} mb={2}>
                    <Button variant="outlined" onClick={() => navigate("/servicos/visualizar")}>
                      Voltar
                    </Button>
                  </Box>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ServiceCreate;
