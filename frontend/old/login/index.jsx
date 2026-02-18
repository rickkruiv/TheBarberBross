import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button, Stack } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../services/index.jsx";


export default function Login() {

const navigate = useNavigate();
const formik = useFormik({
    initialValues: { email: "", senha: "" },
    validationSchema: Yup.object({
    email: Yup.string().email("E-mail inválido").required("Obrigatório"),
    senha: Yup.string().min(6, "Min 6").required("Obrigatório"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
    try {
    const { data } = await api.post("/clientes", values);
    localStorage.setItem("token", data?.token || "");
    navigate("/users");
    } finally { setSubmitting(false); }
    },
});


return (
<Box sx={{ maxWidth: 420, mx: "auto", mt: 6 }}>
    <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <form onSubmit={formik.handleSubmit} noValidate>
            <Stack spacing={2}>
                <TextField label="E-mail" name="email" type="email"
                value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email}
                />
                <TextField label="Senha" name="senha" type="password"
                value={formik.values.senha} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.senha && Boolean(formik.errors.senha)} helperText={formik.touched.senha && formik.errors.senha}
                />
                <Button variant="contained" type="submit" disabled={formik.isSubmitting}>Entrar</Button>
                <Button component={Link} to="/register">Criar conta</Button>
            </Stack>
        </form>
    </Paper>
</Box>
);
}