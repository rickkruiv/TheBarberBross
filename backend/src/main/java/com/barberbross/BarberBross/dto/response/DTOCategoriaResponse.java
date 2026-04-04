package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.enums.TipoProdServ;
import com.barberbross.BarberBross.model.Categoria;

public record DTOCategoriaResponse(
        Long categoriaId,
        String nome,
        String descricao,
        TipoProdServ tipo) {

    public DTOCategoriaResponse(Categoria c){
        this(c.getCategoriaId(), c.getNome(), c.getDescricao(), c.getTipo());
    }
}
