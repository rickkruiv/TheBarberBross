import React, { useState } from "react"
import {
  Box,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider
} from "@mui/material"

export default function EmployeeDetailModal({ open, onClose, employee }) {
  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, textAlign: "center" }}>
        Detalhes do Funcionário
      </DialogTitle>
      <DialogContent>
        {employee && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              py: 1
            }}
          >
            <Avatar
              src={employee.foto || employee.avatarUrl}
              sx={{
                width: 100,
                height: 100,
                fontSize: 40,
                bgcolor: "primary.main"
              }}
            >
              {employee.nome?.charAt(0)}
            </Avatar>

            <Box sx={{ width: "100%", mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Nome
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {employee.nome}
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="caption" color="text.secondary">
                E-mail
              </Typography>
              <Typography variant="body1">{employee.email}</Typography>

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="caption" color="text.secondary">
                Telefone
              </Typography>
              <Typography variant="body1">
                {employee.telefone || "-"}
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="caption" color="text.secondary">
                Nível de Acesso
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: "inline-block",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    fontWeight: 600,
                    textTransform: "capitalize"
                  }}
                >
                  {(employee.nivelAcesso || "Colaborador").toLowerCase()}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          fullWidth
          sx={{ borderRadius: 2 }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
