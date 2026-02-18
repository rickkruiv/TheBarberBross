package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.enums.EstadoCivil;
import com.barberbross.BarberBross.model.Funcionario;

import java.time.LocalDate;

public record DTOFuncionarioSimplesResponse(
        Long funcionarioId,
        String nome,
        String cpf,
        String rg,
        String telefone,
        String email,
        LocalDate nascimento,
        EstadoCivil estadoCivil) {

    public DTOFuncionarioSimplesResponse(Funcionario f){
        this(f.getFuncionarioId(), f.getNome(), f.getCpf(), f.getRg()
                , f.getTelefone(), f.getEmail(), f.getNascimento(), f.getEstadoCivil());
    }
}