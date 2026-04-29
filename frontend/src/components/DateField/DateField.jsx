import React from "react"
import { TextField, InputAdornment, IconButton, Box } from "@mui/material"
import { useMask } from "@react-input/mask"
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined"

export default function DateField({ name, value, onChange, onBlur, label, placeholder = "dd/mm/aaaa" }) {
  const ref = useMask({ mask: "99/99/9999", replacement: { 9: /\d/ } })

  const handleHiddenDateChange = (e) => {
    const isoDate = e.target.value
    if (!isoDate) return
    const [year, month, day] = isoDate.split("-")
    const formatted = `${day}/${month}/${year}`


    if (onChange) {
      onChange({
        target: {
          name,
          value: formatted
        }
      })
    }
  }

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
            <IconButton size="small" sx={{ position: "relative" }}>
              <CalendarMonthOutlined fontSize="small" />
              <input
                type="date"
                onChange={handleHiddenDateChange}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer"
                }}
              />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
}
