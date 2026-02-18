package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.enums.TipoAssinatura;
import com.barberbross.BarberBross.model.Empresa;

public record DTOEmpresaResponse(
        Long empresaId,
        String razaoSocial,
        String nomeFantasia,
        String cnpj,
        String telefone,
        String email,
        TipoAssinatura tipoAssinatura,
        Long enderecoId) {

    public DTOEmpresaResponse(Empresa e){
        this(e.getEmpresaId(), e.getRazaoSocial(), e.getNomeFantasia(), e.getCnpj(),
                e.getTelefone(), e.getEmail(), e.getTipoAssinatura(), e.getEndereco().getEnderecoId());
    }
}
