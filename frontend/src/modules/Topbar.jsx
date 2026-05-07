import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, IconButton, Menu, MenuItem, Tooltip, Zoom } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";

const NAVBAR_ITEMS = [
  { path: "/", id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  {
    path: "/agenda", id: "agenda", label: "Agenda", icon: <EventAvailableIcon />,
    subCategories: [
      { path: "/agenda/novo", label: "Novo Agendamento" },
      { path: "/agenda/visualizar", label: "Visualizar Agendamentos" },
      { path: "/agenda/semanal", label: "Agenda Semanal" },
    ]
  },
  {
    path: "/funcionarios", id: "funcionarios", label: "Funcionários", icon: <PeopleIcon />,
    subCategories: [
      { path: "/funcionarios/cadastrar", label: "Cadastrar" },
      { path: "/funcionarios/visualizar", label: "Visualizar" },
    ]
  },
  {
    path: "/servicos", id: "servicos", label: "Serviços", icon: <WorkIcon />,
    subCategories: [
      { path: "/servicos/cadastrar", label: "Cadastrar" },
      { path: "/servicos/visualizar", label: "Visualizar" },
    ]
  },
  {
    path: "/produtos", id: "produtos", label: "Produtos", icon: <Inventory2Icon />,
    subCategories: [
      { path: "/produtos/cadastrar", label: "Cadastrar" },
      { path: "/produtos/visualizar", label: "Visualizar" },
    ]
  },
  {
    path: "/fornecedores", id: "fornecedores", label: "Fornecedores", icon: <LocalShippingIcon />,
    subCategories: [
      { path: "/fornecedores/cadastrar", label: "Cadastrar" },
      { path: "/fornecedores/visualizar", label: "Visualizar" },
    ]
  },
  {
    path: "/configuracoes", id: "configuracoes", label: "Configurações", icon: <SettingsIcon />,
    subCategories: [
      { path: "/configuracoes/dados-barbearia", label: "Dados da Barbearia" },
      { path: "/configuracoes/categorias", label: "Categorias" },
      { path: "/configuracoes/metodos-pagamento", label: "Métodos de Pagamento" },
    ]
  },
];

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const [userAnchorEl, setUserAnchorEl] = useState(null);

  const handleOpenMenu = (event, item) => {
    if (item.subCategories) {
      setAnchorEl(event.currentTarget);
      setActiveMenuId(item.id);
    } else {
      navigate(item.path);
      handleCloseMenu();
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveMenuId(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseMenu();
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const activeCategoryId = () => {
    if (location.pathname === "/") return "dashboard";
    const match = NAVBAR_ITEMS.find(item => item.path !== "/" && location.pathname.startsWith(item.path));
    return match ? match.id : null;
  };

  const currentActiveId = activeCategoryId();

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1200,

          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1,
          py: 1,
          borderRadius: 50,
          backgroundColor: mode === "dark" ? "rgba(12, 17, 22, 0.75)" : "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(12px)",
          border: mode === "dark" ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: mode === "dark" ? "0 8px 32px rgba(0, 0, 0, 0.5)" : "0 8px 32px rgba(0, 0, 0, 0.1)",

          maxWidth: "95vw",
          overflowX: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {NAVBAR_ITEMS.map((item) => {
          const isActive = currentActiveId === item.id;

          return (
            <Tooltip key={item.id} title={item.label} TransitionComponent={Zoom} placement="bottom">
              <IconButton
                onClick={(e) => handleOpenMenu(e, item)}
                sx={{
                  color: isActive ? "text.primary" : "text.secondary",
                  backgroundColor: isActive ? "primary.main" : "transparent",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: "50%",
                  height: 48,
                  width: 48,
                  boxShadow: isActive ? "0 4px 10px rgba(255, 20, 87, 0.3)" : "none",
                  "&:hover": {
                    color: "text.primary",
                    backgroundColor: isActive ? "primary.main" : (mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                  },
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          );
        })}

        <Box sx={{ width: 1, height: 24, bgcolor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", mx: 1 }} />

        <Tooltip title="Perfil" TransitionComponent={Zoom} placement="bottom">
          <IconButton
            onClick={(e) => setUserAnchorEl(e.currentTarget)}
            sx={{
              color: Boolean(userAnchorEl) ? "text.primary" : "text.secondary",
              backgroundColor: Boolean(userAnchorEl) ? "text.tertiary" : "transparent",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "50%",
              height: 48,
              width: 48,
              "&:hover": {
                color: "text.primary",
                backgroundColor: "text.tertiary",
              },
            }}
          >
            <AccountCircleIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            mt: 1.5,
            bgcolor: "background.paper",
            border: mode === "dark" ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: mode === "dark" ? "0 8px 32px rgba(0, 0, 0, 0.5)" : "0 8px 32px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            minWidth: 200,
          },
        }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        {NAVBAR_ITEMS.find((i) => i.id === activeMenuId)?.subCategories?.map((sub) => {
          const isSubActive = location.pathname === sub.path;
          return (
            <MenuItem
              key={sub.path}
              onClick={() => handleNavigate(sub.path)}
              sx={{
                py: 1.5,
                px: 2.5,
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                color: isSubActive ? "primary.main" : "text.primary",
                backgroundColor: isSubActive ? "rgba(255, 20, 87, 0.1)" : "transparent",
                fontWeight: isSubActive ? 600 : 400,
                "&:hover": {
                  backgroundColor: mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                },
              }}
            >
              {sub.label}
            </MenuItem>
          );
        })}
      </Menu>

      <Menu
        anchorEl={userAnchorEl}
        open={Boolean(userAnchorEl)}
        onClose={() => setUserAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1.5,
            bgcolor: "background.paper",
            border: mode === "dark" ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: mode === "dark" ? "0 8px 32px rgba(0, 0, 0, 0.5)" : "0 8px 32px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            minWidth: 150,
          },
        }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <MenuItem onClick={toggleTheme}>
          {mode === "dark" ? "Modo Claro" : "Modo Escuro"}
        </MenuItem>
        {user?.nivelAcesso === "ADMIN" && (
          <MenuItem onClick={() => {
            setUserAnchorEl(null);
            navigate("/configuracoes/dados-barbearia");
          }}>
            Minha Barbearia
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          setUserAnchorEl(null);
          navigate("/perfil");
        }}>
          Meu Perfil
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: "#ef4444" }}>
          Sair
        </MenuItem>
      </Menu>
    </>
  );
}
