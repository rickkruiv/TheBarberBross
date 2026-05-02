import React from "react"
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip
} from "@mui/material"

export default function ProductDetailModal({
  open,
  onClose,
  product,
  categoryName,
  supplierName
}) {
  if (!product) return null

  const formatCurrency = (value) => {
    if (value == null) return "R$ 0,00"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  }

  const getStockColor = (qtd, min) => {
    if (qtd <= 0) return "error"
    if (qtd <= min) return "warning"
    return "success"
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, textAlign: "center" }}>
        Detalhes do Produto
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            py: 1
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography variant="caption" color="text.secondary">
              Nome do Produto
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {product.nome || "-"}
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Marca
                </Typography>
                <Typography variant="body1">{product.marca || "-"}</Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="caption" color="text.secondary">
                  Categoria
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={categoryName || "Geral"}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600, borderRadius: 1 }}
                  />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="caption" color="text.secondary">
              Fornecedor
            </Typography>
            <Typography variant="body1">
              {supplierName || product.fornecedor || "-"}
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Estoque Atual
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {product.quantidadeEstoque ?? 0}
                  </Typography>
                  <Chip
                    label={
                      Number(product.quantidadeEstoque) <= 0
                        ? "Esgotado"
                        : Number(product.quantidadeEstoque) <= (product.estoqueMinimo || 0)
                        ? "Baixo"
                        : "OK"
                    }
                    size="small"
                    color={getStockColor(
                      product.quantidadeEstoque,
                      product.estoqueMinimo
                    )}
                    sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700 }}
                  />
                </Box>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="caption" color="text.secondary">
                  Preço de Venda
                </Typography>
                <Typography variant="h6" fontWeight={800} color="primary.main">
                  {formatCurrency(product.precoVenda)}
                </Typography>
              </Box>
            </Box>

            {product.descricao && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="caption" color="text.secondary">
                  Descrição
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.descricao}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={onClose}
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
