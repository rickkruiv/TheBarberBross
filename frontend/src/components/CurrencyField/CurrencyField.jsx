import React from "react"
import { TextField, InputAdornment } from "@mui/material"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import { toBRL } from "../../utils/toBRL"

export default function CurrencyField({ value, onChange, ...props }) {
  const handleChange = e => {
    const formatted = toBRL(e.target.value)
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
