package com.barberbross.BarberBross.dto.request;

import jakarta.validation.constraints.NotBlank;

public record DTOEnderecoRequest(
        @NotBlank
        String cep,

        @NotBlank
        String logradouro,

        String complemento,

        @NotBlank
        String numero,

        @NotBlank
        String cidade,

        @NotBlank
        String bairro,

        @NotBlank
        String uf) {}