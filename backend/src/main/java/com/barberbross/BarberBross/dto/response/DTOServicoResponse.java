package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.model.Servico;

import java.math.BigDecimal;

public record DTOServicoResponse(
        Long servicoId,
        String nome,
        String descricao,
        Long categoriaId,
        BigDecimal preco,
        int duracao) {

    public DTOServicoResponse(Servico s) {
        this(s.getServicoId(), s.getNome(), s.getDescricao()
        , s.getCategoria().getCategoriaId(), s.getPreco(), s.getDuracao());
    }
}