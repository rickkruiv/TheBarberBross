package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.enums.NivelAcesso;
import com.barberbross.BarberBross.model.Funcionario;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DTOFuncionarioResponse(
        Long funcionarioId,
        String nome,
        String cpf,
        String telefone,
        String email,
        LocalDate nascimento,
        LocalDate dataContratacao,
        BigDecimal salarioBase,
        BigDecimal percentualComissao,
        Long usuarioId,
        NivelAcesso nivelAcesso) {

    public DTOFuncionarioResponse(Funcionario f) {
        this(f.getFuncionarioId(), f.getNome(), f.getCpf()
                , f.getTelefone(), f.getEmail(), f.getNascimento(), f.getDataContratacao(), f.getSalarioBase(), f.getPercentualComissao()
                , f.getUsuario().getUsuarioId(), f.getUsuario().getNivelAcesso());
    }
}
