package com.barberbross.BarberBross.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record DTOFornecedorRequest(
        @NotBlank
        String nome,

        @NotBlank
        String cnpj,

        @NotBlank
        String telefone,

        @NotBlank
        @Email
        String email) {}