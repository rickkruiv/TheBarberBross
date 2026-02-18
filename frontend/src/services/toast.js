import { toast } from "react-toastify"

const base = { pauseOnHover: true, draggable: true, autoClose: 3000 }

export function toastSuccess(message) {
  toast.success(message, base)
}

export function toastError(err, fallback = "Ops! Algo deu errado") {
  const anyErr = err
  const msg =
    anyErr?.response?.data?.message ||
    anyErr?.response?.data?.error ||
    anyErr?.message ||
    (typeof err === "string" ? err : null)
  toast.error(msg || fallback, base)
}
