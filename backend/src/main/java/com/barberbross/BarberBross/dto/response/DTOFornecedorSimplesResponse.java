package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.model.Fornecedor;

public record DTOFornecedorSimplesResponse(
        Long fornecedorId,
        String razaoSocial,
        String cnpj,
        String telefone,
        String email) {

    public DTOFornecedorSimplesResponse(Fornecedor f){
        this(f.getFornecedorId(), f.getRazaoSocial(), f.getCnpj(), f.getTelefone(), f.getEmail());
    }

}