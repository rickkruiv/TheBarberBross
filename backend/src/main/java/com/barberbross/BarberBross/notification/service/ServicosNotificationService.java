package com.barberbross.BarberBross.notification.service;

import com.barberbross.BarberBross.dto.response.DTOServicoResponse;
import com.barberbross.BarberBross.model.WebSocketPayload;
import com.barberbross.BarberBross.notification.channel.WebSocketNotificationChannel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServicosNotificationService {

    @Autowired
    private WebSocketNotificationChannel webSocketChannel;


    public void notificarNovoServico(DTOServicoResponse response){
        WebSocketPayload<DTOServicoResponse> payload = new WebSocketPayload<>("NOVO SERVICO", response);
        webSocketChannel.notificarEmpresa(response.empresaId(), "servicos", payload);
    }

    public void notificarServicoEditado(DTOServicoResponse response) {
        WebSocketPayload<DTOServicoResponse> payload = new WebSocketPayload<>("SERVICO EDITADO", response);
        webSocketChannel.notificarEmpresa(response.empresaId(), "servicos", payload);
    }
}
