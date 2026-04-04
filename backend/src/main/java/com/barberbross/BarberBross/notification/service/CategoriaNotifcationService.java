package com.barberbross.BarberBross.notification.service;

import com.barberbross.BarberBross.dto.response.DTOCategoriaResponse;
import com.barberbross.BarberBross.model.WebSocketPayload;
import com.barberbross.BarberBross.notification.channel.WebSocketNotificationChannel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaNotifcationService {

    @Autowired
    private WebSocketNotificationChannel webSocketChannel;

    public void notificarNovaCategoria(DTOCategoriaResponse response){
        WebSocketPayload<DTOCategoriaResponse> payload = new WebSocketPayload<>("CATEGORIA CRIADA", response);
        webSocketChannel.notificarEmpresa(response.empresaId(), "categorias", payload);
    }

    public void notificarListaCategorias(List<DTOCategoriaResponse> response){
        WebSocketPayload<List<DTOCategoriaResponse>> payload = new WebSocketPayload<>("LISTA DE CATEGORIAS", response);
        webSocketChannel.notificarEmpresa(response.getFirst().empresaId(), "categorias", payload);
    }

    public void notificarCategoriaEditada(DTOCategoriaResponse response){
        WebSocketPayload<DTOCategoriaResponse> payload = new WebSocketPayload<>("CATEGORIA EDITADA", response);
        webSocketChannel.notificarEmpresa(response.empresaId(), "categorias", payload);
    }
}
