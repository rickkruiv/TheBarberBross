import React from "react"
import { TextField, InputAdornment } from "@mui/material"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"

function formatCurrencyBR(value) {
  const digits = String(value || "").replace(/\D/g, "")
  const num = Number(digits) / 100
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function CurrencyField({ value, onChange, ...props }) {
  const handleChange = e => {
    const formatted = formatCurrencyBR(e.target.value)
    onChange(formatted)
  }
  return (
    <TextField
      value={value}
      onChange={handleChange}
      InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small" /></InputAdornment> }}
      {...props}
    />
  )
}
