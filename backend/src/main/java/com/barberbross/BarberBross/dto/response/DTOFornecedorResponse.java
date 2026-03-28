package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.model.Fornecedor;

public record DTOFornecedorResponse(
        Long fornecedorId,
        String razaoSocial,
        String cnpj,
        String telefone,
        String email,
        Long enderecoId) {

    public DTOFornecedorResponse(Fornecedor f){
        this(f.getFornecedorId(), f.getRazaoSocial(), f.getCnpj(), f.getTelefone(), f.getEmail(),
                f.getEndereco().getEnderecoId());
    }
}