
import React from "react";
import { Box, Paper, Typography, TextField, Button, Stack } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMask } from "@react-input/mask";
import api from "../../services/index.jsx";

function digits(s) { return String(s || "").replace(/\D/g, ""); }
function formatTelefone(s) {
  const d = digits(s);
  if (d.length >= 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7,11)}`;
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6,10)}`;
  return d;
}

export default function Register() {
  const formik = useFormik({
    initialValues: { nome: "", email: "", senha: "", telefone: "" },
    validationSchema: Yup.object({
      nome: Yup.string().required("Obrigatório"),
      email: Yup.string().email("E-mail inválido").required("Obrigatório"),
      senha: Yup.string().min(6, "Min 6").required("Obrigatório"),
      telefone: Yup.string()
        .test("fone", "Telefone inválido", (v) => {
          const n = digits(v);
          return n.length === 11 || n.length === 10;
        })
        .required("Obrigatório"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          nome: values.nome,
          email: values.email,
          senha: values.senha,
          telefone: digits(values.telefone),
        };
        await api.post("/clientes", payload);
        resetForm();
        alert("Cliente cadastrado! Agora faça login.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const telRef = useMask({ mask: "(99) 99999-9999", replacement: { 9: /\d/ } });

  return (
    <Box sx={{ maxWidth: 560, mx: "auto", mt: 6 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Cadastro</Typography>

        <form onSubmit={formik.handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Nome"
              name="nome"
              value={formik.values.nome}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nome && Boolean(formik.errors.nome)}
              helperText={formik.touched.nome && formik.errors.nome}
            />

            <TextField
              label="E-mail"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              label="Senha"
              name="senha"
              type="password"
              value={formik.values.senha}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.senha && Boolean(formik.errors.senha)}
              helperText={formik.touched.senha && formik.errors.senha}
            />

            <TextField
              label="Telefone"
              name="telefone"
              value={formik.values.telefone}
              onChange={(e) => formik.setFieldValue("telefone", e.target.value)}
              onBlur={(e) => formik.setFieldValue("telefone", formatTelefone(e.target.value))}
              error={formik.touched.telefone && Boolean(formik.errors.telefone)}
              helperText={formik.touched.telefone && formik.errors.telefone}
              inputRef={telRef}
              inputProps={{ inputMode: "numeric" }}
              fullWidth
            />

            <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
              Cadastrar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
