package com.barberbross.BarberBross.dto.request;

import com.barberbross.BarberBross.enums.EstadoCivil;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DTOFuncionarioRequest(
        @NotBlank
        String nome,

        @NotBlank
        String cpf,
        String rg,

        @NotBlank
        String telefone,

        @NotBlank
        @Email
        String email,

        @NotNull
        LocalDate nascimento,

        @NotNull
        EstadoCivil estadoCivil) {}