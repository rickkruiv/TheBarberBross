package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.model.Produto;

public record DTOProdutoResponse(
        Long produtoId,
        String nome,
        String descricao,
        Long categoriaId) {

    public DTOProdutoResponse(Produto p) {
        this(p.getProdutoId(), p.getNome(), p.getDescricao(), p.getCategoria().getCategoriaId());
    }
}
