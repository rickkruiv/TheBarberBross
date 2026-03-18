export function toBRL(value) {
  const num = Number(value) / 100
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}