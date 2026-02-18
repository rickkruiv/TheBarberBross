import React from "react"
import { styled } from "@mui/material/styles"
import {
  Drawer,
  Toolbar,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useMediaQuery
} from "@mui/material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import PeopleIcon from "@mui/icons-material/People"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import VisibilityIcon from "@mui/icons-material/Visibility"
import Inventory2Icon from "@mui/icons-material/Inventory2"
import WorkIcon from "@mui/icons-material/Work"
import EventAvailableIcon from "@mui/icons-material/EventAvailable"
import SettingsIcon from "@mui/icons-material/Settings"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import { NavLink } from "react-router-dom"

export const drawerWidth = 300
export const miniWidth = 80

const openedMixin = theme => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", { duration: theme.transitions.duration.shorter }),
  overflowX: "hidden",
  borderRight: "1px solid #1E2733",
  backgroundColor: theme.palette.background.default
})

const closedMixin = theme => ({
  width: miniWidth,
  transition: theme.transitions.create("width", { duration: theme.transitions.duration.shorter }),
  overflowX: "hidden",
  borderRight: "1px solid #1E2733",
  backgroundColor: theme.palette.background.default
})

const DrawerStyled = styled(Drawer, {
  shouldForwardProp: prop => prop !== "open" && prop !== "mobile"
})(({ theme, open, mobile }) => ({
  width: open ? drawerWidth : miniWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  "& .MuiDrawer-paper": mobile ? openedMixin(theme) : open ? openedMixin(theme) : closedMixin(theme)
}))

function Group({ icon, label, children, open: groupOpen, onToggle, sidebarOpen, setSidebarOpen }) {
  const handleClick = () => {
    if (!sidebarOpen) {
      setSidebarOpen(true)
      onToggle()
    } else {
      onToggle()
    }
  }

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
      <Collapse in={sidebarOpen && Boolean(groupOpen)} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 4 }}>
          {children}
        </List>
      </Collapse>
    </>
  )
}

export default function Sidebar({ open, onToggle, setSidebarOpen }) {
  const [openGroup, setOpenGroup] = React.useState("Agenda");
  const isMobile = useMediaQuery("(max-width:900px)")
  const variant = isMobile ? "temporary" : "permanent"

  React.useEffect(() => {
    if (!open) {
      setOpenGroup(null)
    }
  }, [open])

  return (
    <DrawerStyled
      variant={variant}
      open={open}
      onClose={onToggle}
      mobile={isMobile}
      sx={{ display: { xs: "block" } }}
    >
      <Toolbar sx={{ gap: 1, borderBottom: "1px solid #1E2733" }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            bgcolor: "#161D27",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900
          }}
        >
          BB
        </Box>
        <Box sx={{ display: { xs: "block", md: open ? "block" : "none" } }}>
          <Typography variant="subtitle1" fontWeight={800}>
            BarberBross
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Sistema ERP
          </Typography>
        </Box>
      </Toolbar>

      <List
        sx={{
          "& .MuiListItemText-root": {
            opacity: { md: open ? 1 : 0, xs: 1 },
            transition: "opacity .2s"
          },
          mt: 1
        }}
      >
        {open && (
          <Typography
          variant="caption"
          sx={{
            px: 2,
            pb: 0.5,
            color: "text.secondary",
            textTransform: "uppercase",
            fontWeight: 600
          }}
        >
          Menu Principal
        </Typography>
        )}

        <ListItemButton component={NavLink} to="/">
          <ListItemIcon sx={{ minWidth: 40 }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <Group icon={<EventAvailableIcon />}
               label="Agenda"
               open={openGroup === "Agenda"}
               onToggle={() => setOpenGroup(openGroup === "Agenda" ? null : "Agenda")}
               sidebarOpen={open}
               setSidebarOpen={setSidebarOpen} >
          <ListItemButton component={NavLink} to="/agenda/novo">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AddCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Novo Agendamento" />
          </ListItemButton>
          <ListItemButton component={NavLink} to="/agenda/visualizar">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText primary="Visualizar Agendamentos" />
          </ListItemButton>
          <ListItemButton component={NavLink} to="/agenda/semanal">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <EventAvailableIcon />
            </ListItemIcon>
            <ListItemText primary="Agenda Semanal" />
          </ListItemButton>
        </Group>
 
        <Group icon={<PeopleIcon />}
               label="Funcionários"
               open={openGroup === "Funcionários"}
               onToggle={() => setOpenGroup(openGroup === "Funcionários" ? null : "Funcionários")}
               sidebarOpen={open}
               setSidebarOpen={setSidebarOpen}>
          <ListItemButton component={NavLink} to="/funcionarios/cadastrar">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AddCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Cadastrar" />
          </ListItemButton>
          <ListItemButton component={NavLink} to="/funcionarios/visualizar">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText primary="Visualizar" />
          </ListItemButton>
        </Group>

        <Group icon={<WorkIcon />}
               label="Serviços"
               open={openGroup === "Serviços"}
               onToggle={() => setOpenGroup(openGroup === "Serviços" ? null : "Serviços")}
               sidebarOpen={open}
               setSidebarOpen={setSidebarOpen}>
          <ListItemButton component={NavLink} to="/servicos/cadastrar">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AddCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Cadastrar" />
          </ListItemButton>
          <ListItemButton component={NavLink} to="/servicos/visualizar">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText primary="Visualizar" />
          </ListItemButton>
        </Group>

        <Group icon={<Inventory2Icon />} 
               label="Produtos"
               open={openGroup === "Produtos"}
               onToggle={() => setOpenGroup(openGroup === "Produtos" ? null : "Produtos")}
               sidebarOpen={open}
               setSidebarOpen={setSidebarOpen}>
          <ListItemButton component={NavLink} to="/produtos/cadastrar">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AddCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Cadastrar" />
          </ListItemButton>
          <ListItemButton component={NavLink} to="/produtos/visualizar">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText primary="Visualizar" />
          </ListItemButton>
        </Group>

        <Group icon={<LocalShippingIcon />} 
               label="Fornecedores"
               open={openGroup === "Fornecedores"}
               onToggle={() => setOpenGroup(openGroup === "Fornecedores" ? null : "Fornecedores")}
               sidebarOpen={open}
               setSidebarOpen={setSidebarOpen}>
          <ListItemButton component={NavLink} to="/fornecedores/cadastrar">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AddCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Cadastrar" />
          </ListItemButton>
          <ListItemButton component={NavLink} to="/fornecedores/visualizar">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText primary="Visualizar" />
          </ListItemButton>
        </Group>

        <Group icon={<SettingsIcon />} 
               label="Configurações"
               open={openGroup === "Configurações"}
               onToggle={() => setOpenGroup(openGroup === "Configurações" ? null : "Configurações")}
               sidebarOpen={open}
               setSidebarOpen={setSidebarOpen}>
          <ListItemButton component={NavLink} to="/configuracoes/dados-barbearia">
            <ListItemText primary="Dados da Barbearia" />
          </ListItemButton>
          <ListItemButton component={NavLink} to="/configuracoes/categorias">
            <ListItemText primary="Categorias" />
          </ListItemButton>
          <ListItemButton component={NavLink} to="/configuracoes/metodos-pagamento">
            <ListItemText primary="Métodos de Pagamento" />
          </ListItemButton>
        </Group>
      </List>
    </DrawerStyled>
  )
}
