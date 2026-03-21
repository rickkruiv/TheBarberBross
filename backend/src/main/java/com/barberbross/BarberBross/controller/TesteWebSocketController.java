package com.barberbross.BarberBross.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class TesteWebSocketController {

    @MessageMapping("/mensagem")
    @SendTo("/topic/mensagem")
    public String enviarMensagem(String msg) {
        return "Recebido: " + msg;
    }
}
