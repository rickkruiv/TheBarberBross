export function toBRL(value) {
  const onlyNums = String(value).replace(/\D/g, "")
  const num = Number(onlyNums) / 100
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}