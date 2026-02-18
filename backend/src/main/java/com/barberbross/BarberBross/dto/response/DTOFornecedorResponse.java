package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.model.Fornecedor;

public record DTOFornecedorResponse(
        Long fornecedorId,
        String nome,
        String cnpj,
        String telefone,
        String email,
        Long enderecoId) {

    public DTOFornecedorResponse(Fornecedor f){
        this(f.getFornecedorId(), f.getNome(), f.getCnpj(), f.getTelefone(), f.getEmail(),
                f.getEndereco().getEnderecoId());
    }
}