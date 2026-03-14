package com.barberbross.BarberBross.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DTOFuncionarioRequest(
        @NotBlank
        String nome,

        @NotBlank
        String cpf,

        @NotBlank
        String telefone,

        @NotBlank
        @Email
        String email,

        @NotBlank
        String senha,

        @NotNull
        LocalDate nascimento,

        @NotNull
        LocalDate dataContratacao,

        @NotNull
        BigDecimal salarioBase,

        @NotNull
        BigDecimal percentualComissao) {}