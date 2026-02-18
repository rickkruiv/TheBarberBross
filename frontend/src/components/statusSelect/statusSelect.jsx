import { Chip, Select, MenuItem } from "@mui/material";

const statusOptions = [
  { label: "Pendente",   value: "PENDENTE",      color: "warning" },
  { label: "Confirmado", value: "EM_ANDAMENTO",  color: "info" },
  { label: "Concluído",  value: "CONCLUIDO",     color: "success" },
  { label: "Cancelado",  value: "CANCELADO",     color: "error" },
];

export default function StatusSelect({ status, onChange }) {
  return (
    <Select
      value={status ?? ""}
      onChange={(e) => onChange(e.target.value)}
      variant="standard"
      disableUnderline
      sx={{ minWidth: 100 }}
      renderValue={(value) => {
        const item = statusOptions.find(s => s.value === value);
        if (!item) return <Chip label="Status inválido" size="small" />; 
        return (
          <Chip
            label={item.label}
            color={item.color}
            size="small"
            sx={{ fontWeight: 700, width: '100px' }}
          />
        );
      }}
    >
      {statusOptions.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
            <Chip
                label={opt.label}
                color={opt.color}
                size="small"
                sx={{ fontWeight: 700, width: '100px' }}
            />
        </MenuItem>

      ))}
    </Select>
  );
}