package com.barberbross.BarberBross.notification.service;

import com.barberbross.BarberBross.dto.response.DTOAvaliacaoResponse;
import com.barberbross.BarberBross.model.WebSocketPayload;
import com.barberbross.BarberBross.notification.channel.WebSocketNotificationChannel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AvaliacaoNotificationService {

    @Autowired
    private WebSocketNotificationChannel webSocketChannel;

    public void notificarAvaliacaoAgendamento(DTOAvaliacaoResponse response){
        WebSocketPayload<DTOAvaliacaoResponse> payload = new WebSocketPayload<>("AGENDAMENTO AVALIADO", response);
        webSocketChannel.notificarEmpresa(response.empresaId(), "avaliacoes", payload);
        webSocketChannel.notificarFuncionario(response.funcionarioId(), "avaliacoes", payload);
    }

    public void notificarEdicaoAvaliacaoAgendamento(DTOAvaliacaoResponse response){
        WebSocketPayload<DTOAvaliacaoResponse> payload = new WebSocketPayload<>("AVALIAÇÃO EDITADA", response);
        webSocketChannel.notificarEmpresa(response.empresaId(), "avaliacoes", payload);
        webSocketChannel.notificarFuncionario(response.funcionarioId(), "avaliacoes", payload);
    }
}
