import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./Protected";
import DashboardLayout from "../layouts/DashboardLayout";
import EmployeesCreate from "../pages/empregados/EmployeesCreate";
import EmployeesList from "../pages/empregados/EmployeesList";
import ServicesCreate from "../pages/servicos/ServicesCreate";
import ServicesList from "../pages/servicos/ServicesList";
import PaymentMethodsList from "../pages/pagamentos/PaymentMethodsList";
import FornecedorCreate from "../pages/fornecedores/FornecedorCreate";
import FornecedoresList from "../pages/fornecedores/FornecedoresList";
import ProdutoCreate from "../pages/produtos/ProdutoCreate";
import ProdutoList from "../pages/produtos/ProdutoList";
import SettingsCategories from "../pages/categorias/categorias";
import Dashboard from "../pages/dashboard/Dashboard";
import AgendamentoCreate from "../pages/agendamento/AgendamentoCreate";
import AgendamentosList from "../pages/agendamento/AgendamentosList";
import AgendaSemanal from "../pages/agendamento/AgendaSemanal";
import Login from "../pages/login/Login";
import { AuthProvider } from "../contexts/AuthContext";
import TesteWebSocket from "../components/TesteWebSocket/TesteWebsockt";

export default function Rotas() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/teste-websocket" element={<TesteWebSocket />} />
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
      </BrowserRouter>
    </AuthProvider>
  );
}