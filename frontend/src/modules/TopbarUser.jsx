import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MenuDown from "../components/MenuDown/MenuDown";
import { useAuth } from "../contexts/AuthContext";

export default function TopbarUser() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Tooltip title="Notificações">
        <IconButton>
          <NotificationsNoneIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Ajuda">
        <IconButton>
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>

      <MenuDown onLogout={handleLogout} />
    </>
  );
}