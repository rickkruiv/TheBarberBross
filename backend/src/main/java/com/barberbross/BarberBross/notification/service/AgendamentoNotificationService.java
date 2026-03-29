package com.barberbross.BarberBross.notification.service;

import com.barberbross.BarberBross.dto.response.DTOAgendamentoResponse;
import com.barberbross.BarberBross.dto.response.DTOAvaliacaoResponse;
import com.barberbross.BarberBross.model.Agendamento;
import com.barberbross.BarberBross.model.WebSocketPayload;
import com.barberbross.BarberBross.notification.channel.WebSocketNotificationChannel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AgendamentoNotificationService {

    @Autowired
    private WebSocketNotificationChannel webSocketChannel; //sera que esse é melhor jeito???

    public void notificarAgendamentoEditado(Agendamento agendamento, DTOAgendamentoResponse response){
        WebSocketPayload<DTOAgendamentoResponse> payload =
                new WebSocketPayload<>("AGENDAMENTO EDITADO", response);

        webSocketChannel.notificarEmpresa(agendamento.getEmpresa().getEmpresaId(), "agendamentos", payload);
        webSocketChannel.notificarFuncionario(agendamento.getFuncionario().getFuncionarioId(), "agenda", payload);
    }

    public void notificarStatusAgendamento(Agendamento agendamento, DTOAgendamentoResponse response){
        WebSocketPayload<DTOAgendamentoResponse> payload = new WebSocketPayload<>("AGENDAMENTO EDITADO", response);

        webSocketChannel.notificarEmpresa(agendamento.getEmpresa().getEmpresaId(), "agendamentos",payload);
        webSocketChannel.notificarFuncionario(agendamento.getCliente().getClienteId(), "agenda", payload);
    }

    public void notificarAgendamentoCriado(DTOAgendamentoResponse response){
        WebSocketPayload<DTOAgendamentoResponse> payload = new WebSocketPayload<>("AGENDAMENTO CRIADO", response);
        webSocketChannel.notificarEmpresa(response.empresaId(), "agendamentos", payload);
        webSocketChannel.notificarFuncionario(response.funcionarioId(), "agenda", payload);
    }

    public void notificarAgendamentoDeletado(Agendamento agendamento) {
        WebSocketPayload<DTOAgendamentoResponse> payload = new WebSocketPayload<>("AGENDAMENTO DELETADO");
        webSocketChannel.notificarEmpresa(agendamento.getEmpresa().getEmpresaId(), "agendamentos", payload);
        webSocketChannel.notificarFuncionario(agendamento.getFuncionario().getFuncionarioId(), "agenda", payload);
    }
}
