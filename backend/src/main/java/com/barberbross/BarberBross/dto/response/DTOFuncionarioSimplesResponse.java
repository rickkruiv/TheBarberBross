package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.model.Funcionario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DTOFuncionarioSimplesResponse(
        Long funcionarioId,
        String nome,
        String cpf,
        String telefone,
        String email,
        LocalDate nascimento,
        LocalDate dataContratacao,
        BigDecimal salarioBase,
        BigDecimal percentualComissao) {

    //sepa tirar isso aqui, não lembro pq criei isso aqui (lembrei, era pra testar o post de funcionario, dps tem que colocar pra passar endereço no request normal)
    //é PROVISÓRIO

    public DTOFuncionarioSimplesResponse(Funcionario f) {
        this(f.getFuncionarioId(), f.getNome(), f.getCpf(),
                f.getTelefone(), f.getEmail(), f.getNascimento(),
                f.getDataContratacao(), f.getSalarioBase(), f.getPercentualComissao());
    }
}