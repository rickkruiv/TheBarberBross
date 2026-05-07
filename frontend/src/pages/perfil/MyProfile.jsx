import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Paper
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
import MaskedTextField from "../../components/MaskedTextField/MaskedTextField"
import CurrencyField from "../../components/CurrencyField/CurrencyField"
import DateField from "../../components/DateField/DateField"
import SectionCard from "../../shared/SectionCard/SectionCard"
import AvatarUpload from "../../components/AvatarUpload/AvatarUpload"
import ActionBar from "../../components/ActionBar/ActionBar"
import { useUpdateEmployee, useUpdateEmployeeProfile, useEmployee } from "../../services/employees"
import { toastSuccess, toastError } from "../../services/toast"
import DefaultLoading from "../../shared/Loading/DefaultLoading"
import { useAuth } from "../../contexts/AuthContext"

const schema = Yup.object({
  nome: Yup.string().required("Informe o nome"),
  cpf: Yup.string().required("CPF obrigatório"),
  telefone: Yup.string().required("Informe o telefone"),
  email: Yup.string().email("E-mail inválido").required("Informe o e-mail"),
  senha: Yup.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  confirmarSenha: Yup.string().oneOf([Yup.ref("senha")], "As senhas não coincidem"),
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

export default function MyProfile() {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)

  const { user } = useAuth()

  // Try to use funcionarioId, otherwise fallback to userId (might happen if user is an admin registered directly without an employee profile, though usually they have it)
  const employeeId = user?.funcionarioId || user?.userId

  const [initialValues, setInitialValues] = useState({
    ...defaultInitialValues,
    empresaId: user?.empresaId || 1
  })

  const { data: emp, isLoading: loadingEmp } = useEmployee(employeeId)
  const updateMutation = useUpdateEmployee()
  const updateProfileMutation = useUpdateEmployeeProfile()

  const isAdmin = user?.nivelAcesso === "ADMIN"

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
        nivelAcesso: emp.nivelAcesso || "COLABORADOR",
        senha: "", // Reset password fields
        confirmarSenha: ""
      })
    } else if (user?.empresaId) {
      setInitialValues(prev => ({ ...prev, empresaId: user.empresaId }))
    }
  }, [emp, user])

  if (!employeeId) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">Não foi possível carregar os dados do perfil.</Typography>
      </Box>
    )
  }

  if (loadingEmp) {
    return <DefaultLoading loadMessage="Carregando perfil..." />
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

      <Box>
        <Typography variant="h4" fontWeight={800} sx={{ color: "text.primary", mb: 1 }}>
          Meu Perfil
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Visualize e edite as informações da sua conta.
        </Typography>
      </Box>

      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async (values, { resetForm }) => {
          try {
            // For password updates, if the user didn't type anything, we shouldn't send the empty string.
            // But since the backend validator has @NotBlank on senha, we MUST send it. 
            // The user must provide their password to update the profile.
            if (!values.senha) {
              toastError("Você precisa preencher a senha para salvar as alterações.")
              return;
            }

            if (isAdmin) {
              await updateMutation.mutateAsync({ id: employeeId, values })
              toastSuccess("Perfil atualizado com sucesso")
            } else {
              await updateProfileMutation.mutateAsync({ id: employeeId, values })
              toastSuccess("Perfil atualizado com sucesso")
            }
          } catch (e) {
            toastError(e, "Falha ao atualizar o perfil")
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, submitForm }) => (
          <Form noValidate>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

              <SectionCard icon={<PersonOutline fontSize="small" />} title="Dados Pessoais">
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                  <Box sx={{ display: "grid", justifyItems: "center", alignItems: "center", width: { xs: "100%", md: 260 } }}>
                    <AvatarUpload disabled={!isAdmin} />
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
                          disabled={!isAdmin}
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
                          disabled={!isAdmin}
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
                          disabled={!isAdmin}
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
                          withAttach={isAdmin}
                          disabled={!isAdmin}
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
                          label="Salário Base"
                          value={values.salarioBase}
                          onChange={v => setFieldValue("salarioBase", v)}
                          error={touched.salarioBase && Boolean(errors.salarioBase)}
                          helperText={touched.salarioBase && errors.salarioBase}
                          disabled={!isAdmin}
                        />
                      </Box>
                      <Box>
                        <TextField
                          fullWidth
                          label="Percentual de Comissão (%)"
                          name="percentualComissao"
                          type="number"
                          value={values.percentualComissao}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.percentualComissao && Boolean(errors.percentualComissao)}
                          helperText={touched.percentualComissao && errors.percentualComissao}
                          disabled={!isAdmin}
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
                      label="Nova Senha"
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
                      label="Confirmar Nova Senha"
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
                      disabled={!isAdmin}
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
                  onCancel={() => { }} // Could be handled or hidden, let's keep it empty or navigate away
                  onSubmit={submitForm}
                  submitText="Salvar Perfil"
                  cancelText="Limpar"
                />
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  )
}
