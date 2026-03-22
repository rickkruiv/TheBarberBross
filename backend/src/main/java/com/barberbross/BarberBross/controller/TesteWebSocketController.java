package com.barberbross.BarberBross.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/teste-websocket")
public class TesteWebSocketController {

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @GetMapping
    public void teste() {
        simpMessagingTemplate.convertAndSend(
                "/topic/empresa/1/agendamentos",
                "Teste vindo do backend"
        );
    }
}
