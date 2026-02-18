package com.barberbross.BarberBross.dto.request;

import com.barberbross.BarberBross.enums.TipoAssinatura;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DTOEmpresaRequest(
        @NotBlank
        String razaoSocial,

        @NotBlank
        String nomeFantasia,

        @NotBlank
        String cnpj,

        @NotBlank
        String telefone,

        @NotBlank
        @Email
        String email,

        @NotNull
        TipoAssinatura tipoAssinatura) {}