import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import ProtectedRoute from "./Protected";
import DashboardLayout from "../layouts/DashboardLayout";
import { AuthProvider } from "../contexts/AuthContext";
import { WebSocketProvider } from "../contexts/WebSocketContext";

const EmployeesCreate = lazy(() => import("../pages/empregados/EmployeesCreate"));
const EmployeesList = lazy(() => import("../pages/empregados/EmployeesList"));
const ServicesCreate = lazy(() => import("../pages/servicos/ServicesCreate"));
const ServicesList = lazy(() => import("../pages/servicos/ServicesList"));
const PaymentMethodsList = lazy(() => import("../pages/pagamentos/PaymentMethodsList"));
const FornecedorCreate = lazy(() => import("../pages/fornecedores/FornecedorCreate"));
const FornecedoresList = lazy(() => import("../pages/fornecedores/FornecedoresList"));
const ProdutoCreate = lazy(() => import("../pages/produtos/ProdutoCreate"));
const ProdutoList = lazy(() => import("../pages/produtos/ProdutoList"));
const SettingsCategories = lazy(() => import("../pages/categorias/categorias"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const AgendamentoCreate = lazy(() => import("../pages/agendamento/AgendamentoCreate"));
const AgendamentosList = lazy(() => import("../pages/agendamento/AgendamentosList"));
const AgendaSemanal = lazy(() => import("../pages/agendamento/AgendaSemanal"));
const Login = lazy(() => import("../pages/login/Login"));

export default function Rotas() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <BrowserRouter>
          <Suspense fallback={<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "primary.main" }}>Carregando...</Box>}>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />

                  <Route path="funcionarios">
                    <Route path="cadastrar" element={<EmployeesCreate />} />
                    <Route path="visualizar" element={<EmployeesList />} />
                    <Route path=":id" element={<EmployeesCreate />} />
                    <Route path=":id/editar" element={<EmployeesCreate />} />
                  </Route>

                  <Route path="servicos">
                    <Route path="cadastrar" element={<ServicesCreate />} />
                    <Route path="visualizar" element={<ServicesList />} />
                    <Route path=":id" element={<ServicesCreate />} />
                    <Route path=":id/editar" element={<ServicesCreate />} />
                  </Route>

                  <Route path="fornecedores">
                    <Route path="cadastrar" element={<FornecedorCreate />} />
                    <Route path="visualizar" element={<FornecedoresList />} />
                    <Route path=":id" element={<FornecedorCreate />} />
                    <Route path=":id/editar" element={<FornecedorCreate />} />
                  </Route>

                  <Route path="produtos">
                    <Route index element={<Navigate to="visualizar" replace />} />
                    <Route path="cadastrar" element={<ProdutoCreate />} />
                    <Route path="visualizar" element={<ProdutoList />} />
                    <Route path=":id" element={<ProdutoCreate />} />
                    <Route path=":id/editar" element={<ProdutoCreate />} />
                  </Route>

                  <Route path="agenda">
                    <Route path="novo" element={<AgendamentoCreate />} />
                    <Route path="visualizar" element={<AgendamentosList />} />
                    <Route path=":id/editar" element={<AgendamentoCreate />} />
                    <Route path="semanal" element={<AgendaSemanal />} />
                  </Route>

                  <Route path="configuracoes">
                    <Route path="categorias" element={<SettingsCategories />} />
                    <Route path="metodos-pagamento" element={<PaymentMethodsList />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </WebSocketProvider>
    </AuthProvider>
  );
}