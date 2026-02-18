package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.enums.TipoProdServ;
import com.barberbross.BarberBross.model.Preco;

import java.time.LocalDateTime;

public record DTOPrecoResponse(
        Long precoId,
        LocalDateTime dataInicio,
        LocalDateTime dataFim,
        double valor,
        TipoProdServ tipo,
        String descricao) {

    public DTOPrecoResponse(Preco p) {
        this(p.getPrecoId(),p.getDataInicio(), p.getDataFim(), p.getValor()
        , p.getTipo(), p.getDescricao());
    }
}
