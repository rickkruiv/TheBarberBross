import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import PersonOutline from "@mui/icons-material/PersonOutline"
import WorkOutline from "@mui/icons-material/WorkOutline"
import PaidOutlined from "@mui/icons-material/PaidOutlined"
import SecurityOutlined from "@mui/icons-material/SecurityOutlined"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import MaskedTextField from "../../components/MaskedTextField/MaskedTextField"
import CurrencyField from "../../components/CurrencyField/CurrencyField"
import DateField from "../../components/DateField/DateField"
import SectionCard from "../../shared/SectionCard/SectionCard"
import AvatarUpload from "../../components/AvatarUpload/AvatarUpload"
import ActionBar from "../../components/ActionBar/ActionBar"
import { useCreateEmployee, useUpdateEmployee, useEmployee } from "../../services/employees"
import { toastSuccess, toastError } from "../../services/toast"
import DefaultLoading from "../../shared/Loading/DefaultLoading"
import { useAuth } from "../../contexts/AuthContext"

const schema = Yup.object({
  nome: Yup.string().required("Informe o nome"),
  cpf: Yup.string().required("CPF obrigatório"),
  telefone: Yup.string().required("Informe o telefone"),
  email: Yup.string().email("E-mail inválido").required("Informe o e-mail"),
  senha: Yup.string().min(8, "A senha deve ter pelo menos 8 caracteres").required("Informe a senha"),
  confirmarSenha: Yup.string().oneOf([Yup.ref("senha")], "As senhas não coincidem").required("Confirme a senha"),
  nascimento: Yup.string().required("Data de nascimento obrigatória"),
  dataContratacao: Yup.string().required("Data de contratação obrigatória"),
  salarioBase: Yup.string().required("Informe o salário base"),
  percentualComissao: Yup.number().min(0).max(100).required("Informe o percentual de comissão"),
  empresaId: Yup.number().required("ID da empresa é obrigatório"),
  nivelAcesso: Yup.string().required("Informe o nível de acesso")
})

function formatDateFromApi(iso) {
  if (!iso) return ""
  const [ano, mes, dia] = iso.split("-")
  if (!ano || !mes || !dia) return ""
  return `${dia}/${mes}/${ano}`
}

const defaultInitialValues = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  senha: "",
  confirmarSenha: "",
  nascimento: "",
  dataContratacao: formatDateFromApi(new Date().toISOString().slice(0, 10)),
  salarioBase: "R$ 0,00",
  percentualComissao: "0",
  empresaId: "",
  nivelAcesso: "COLABORADOR"
}

const fieldCol = {
  flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" }
}

export default function EmployeesCreate() {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)

  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const isEdit = !!id && location.pathname.endsWith("/editar")

  const { user } = useAuth()
  const [initialValues, setInitialValues] = useState({
    ...defaultInitialValues,
    empresaId: user?.empresaId || 1
  })

  const { data: emp, isLoading: loadingEmp } = useEmployee(id)
  const createMutation = useCreateEmployee()
  const updateMutation = useUpdateEmployee()

  useEffect(() => {
    if (emp) {
      setInitialValues({
        ...defaultInitialValues,
        nome: emp.nome || "",
        cpf: emp.cpf || "",
        telefone: emp.telefone || "",
        email: emp.email || "",
        nascimento: emp.nascimento ? formatDateFromApi(emp.nascimento) : "",
        dataContratacao: emp.dataContratacao ? formatDateFromApi(emp.dataContratacao) : formatDateFromApi(new Date().toISOString().slice(0, 10)),
        salarioBase: emp.salarioBase ? `R$ ${emp.salarioBase}` : "R$ 0,00",
        percentualComissao: emp.percentualComissao || "0",
        empresaId: emp.empresaId || user?.empresaId || 1,
        nivelAcesso: emp.nivelAcesso || "COLABORADOR"
      })
    } else if (user?.empresaId) {
      setInitialValues(prev => ({ ...prev, empresaId: user.empresaId }))
    }
  }, [emp, user])

  if (loadingEmp) {
    return <DefaultLoading loadMessage="Carregando funcionário..." />
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async (values, { resetForm }) => {
          try {
            if (isEdit) {
              await updateMutation.mutateAsync({ id, values })
              toastSuccess("Funcionário atualizado com sucesso")
              navigate("/funcionarios/visualizar")
            } else {
              await createMutation.mutateAsync(values)
              toastSuccess("Funcionário salvo com sucesso")
              resetForm()
            }
          } catch (e) {
            toastError(e, isEdit ? "Falha ao atualizar funcionário" : "Falha ao salvar funcionário")
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, submitForm }) => (
          <Form noValidate>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              
              <SectionCard icon={<PersonOutline fontSize="small" />} title="Dados Pessoais">
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                  <Box sx={{ display: "grid", justifyItems: "center", alignItems: "center", width: { xs: "100%", md: 260 } }}>
                    <AvatarUpload />
                  </Box>
                  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                    
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Box sx={fieldCol}>
                        <TextField
                          fullWidth
                          label="Nome Completo"
                          name="nome"
                          value={values.nome}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.nome && Boolean(errors.nome)}
                          helperText={touched.nome && errors.nome}
                        />
                      </Box>
                      <Box sx={fieldCol}>
                        <MaskedTextField
                          fullWidth
                          label="CPF"
                          name="cpf"
                          mask="000.000.000-00"
                          value={values.cpf}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.cpf && Boolean(errors.cpf)}
                          helperText={touched.cpf && errors.cpf}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Box sx={fieldCol}>
                        <DateField
                          label="Data de Nascimento"
                          name="nascimento"
                          value={values.nascimento}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Box>
                      <Box sx={fieldCol}>
                        <MaskedTextField
                          fullWidth
                          label="Telefone"
                          name="telefone"
                          mask="(00) 00000-0000"
                          value={values.telefone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.telefone && Boolean(errors.telefone)}
                          helperText={touched.telefone && errors.telefone}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Box sx={fieldCol}>
                        <TextField
                          fullWidth
                          type="email"
                          label="E-mail"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </SectionCard>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <SectionCard icon={<WorkOutline fontSize="small" />} title="Dados Profissionais">
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box>
                        <DateField
                          label="Data de Contratação"
                          name="dataContratacao"
                          value={values.dataContratacao}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          withAttach
                        />
                      </Box>
                    </Box>
                  </SectionCard>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <SectionCard icon={<PaidOutlined fontSize="small" />} title="Remuneração">
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box>
                        <CurrencyField
                          fullWidth
                          label="Salário Base *"
                          value={values.salarioBase}
                          onChange={v => setFieldValue("salarioBase", v)}
                          error={touched.salarioBase && Boolean(errors.salarioBase)}
                          helperText={touched.salarioBase && errors.salarioBase}
                        />
                      </Box>
                      <Box>
                        <TextField
                          fullWidth
                          label="Percentual de Comissão (%) *"
                          name="percentualComissao"
                          type="number"
                          value={values.percentualComissao}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.percentualComissao && Boolean(errors.percentualComissao)}
                          helperText={touched.percentualComissao && errors.percentualComissao}
                        />
                      </Box>
                    </Box>
                  </SectionCard>
                </Box>
              </Box>

              <SectionCard icon={<SecurityOutlined fontSize="small" />} title="Credenciais de Acesso ao Sistema">
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Senha"
                      type={showPass ? "text" : "password"}
                      name="senha"
                      value={values.senha}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.senha && Boolean(errors.senha)}
                      helperText={touched.senha && errors.senha}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPass(s => !s)} edge="end">
                              {showPass ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      label="Confirmar Senha"
                      type={showPass2 ? "text" : "password"}
                      name="confirmarSenha"
                      value={values.confirmarSenha}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.confirmarSenha && Boolean(errors.confirmarSenha)}
                      helperText={touched.confirmarSenha && errors.confirmarSenha}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPass2(s => !s)} edge="end">
                              {showPass2 ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Box>
                  <Box>
                    <TextField
                      select
                      fullWidth
                      label="Nível de Acesso"
                      name="nivelAcesso"
                      value={values.nivelAcesso}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.nivelAcesso && Boolean(errors.nivelAcesso)}
                      helperText={touched.nivelAcesso && errors.nivelAcesso}
                    >
                      <MenuItem value="ADMIN">Administrador</MenuItem>
                      <MenuItem value="COLABORADOR">Colaborador</MenuItem>
                    </TextField>
                  </Box>
                  <Box>
                    <Box
                      sx={{
                        border: 1, borderColor: "divider",
                        bgcolor: isDark ? "#141B24" : "rgba(255, 20, 87, 0.05)",
                        p: 2,
                        borderRadius: 2
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, mb: 1 }}>Dicas de Segurança</Typography>
                      <Box sx={{ display: "grid", gap: 0.5 }}>
                        <Typography variant="body2">Use no mínimo 8 caracteres</Typography>
                        <Typography variant="body2">Combine letras maiúsculas e minúsculas</Typography>
                        <Typography variant="body2">Adicione números e símbolos especiais</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </SectionCard>

              <Box>
                <ActionBar
                  onCancel={() => toastError("Cadastro cancelado")}
                  onSubmit={submitForm}
                  onPreview={() => toastSuccess("Pré-visualização gerada")}
                />
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  )
}
