import React from "react"
import { TextField, InputAdornment, IconButton } from "@mui/material"
import { useMask } from "@react-input/mask"
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined"
import AttachFileOutlined from "@mui/icons-material/AttachFileOutlined"

export default function DateField({ name, value, onChange, onBlur, label, placeholder = "mm/dd/yyyy", withAttach = false }) {
  const ref = useMask({ mask: "99/99/9999", replacement: { 9: /\d/ } })
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      inputRef={ref}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {withAttach && (
              <IconButton size="small" disabled>
                <AttachFileOutlined fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" disabled>
              <CalendarMonthOutlined fontSize="small" />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
}
