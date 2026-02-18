package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.model.Fornecedor;

public record DTOFornecedorSimplesResponse(
        Long fornecedorId,
        String nome,
        String cnpj,
        String telefone,
        String email) {

    public DTOFornecedorSimplesResponse(Fornecedor f){
        this(f.getFornecedorId(), f.getNome(), f.getCnpj(), f.getTelefone(), f.getEmail());
    }

}