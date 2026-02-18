package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.model.Avaliacao;

import java.time.LocalDateTime;

public record DTOAvaliacaoResponse(
        Long avaliacaoId,
        Long clienteId,
        Long empresaId,
        Long servicoId,
        Integer avaliacao,
        String comentario,
        LocalDateTime data) {

    public DTOAvaliacaoResponse(Avaliacao a){
        this(a.getAvaliacaoId(), a.getCliente().getClienteId(), a.getEmpresa().getEmpresaId(),
                a.getServico().getServicoId(), a.getAvaliacao(), a.getComentario(), a.getData());
    }
}
