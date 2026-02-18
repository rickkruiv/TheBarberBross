package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.model.Estoque;
import com.barberbross.BarberBross.model.ItemEstoque;

import java.util.List;

public record DTOEstoqueResponse(
        Long estoqueId,
        List<ItemEstoque> produtos) {

    public DTOEstoqueResponse(Estoque e){
        this(e.getEstoqueId(), e.getProdutos());
    }

}