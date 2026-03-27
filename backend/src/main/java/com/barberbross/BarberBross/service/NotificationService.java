package com.barberbross.BarberBross.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public <T> void notificarEmpresa(Long empresaId, String contexto, T payload){
        messagingTemplate.convertAndSend("/topic/" + empresaId + "/" + contexto, payload);
    }

    public <T> void notificarFuncionario(Long funcionarioId, String contexto, T payload){
        messagingTemplate.convertAndSend("/queue/"+ contexto + "/" + funcionarioId, payload);
    }


}