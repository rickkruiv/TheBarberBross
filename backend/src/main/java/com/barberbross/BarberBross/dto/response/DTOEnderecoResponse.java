package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.model.Endereco;

public record DTOEnderecoResponse(
        Long enderecoId,
        String cep,
        String logradouro,
        String complemento,
        String numero,
        String cidade,
        String bairro,
        String uf) {

    public DTOEnderecoResponse(Endereco e){
        this(e.getEnderecoId(), e.getCep(), e.getLogradouro(), e.getComplemento(),
                e.getNumero(), e.getCidade(), e.getBairro(), e.getUf());
    }

}