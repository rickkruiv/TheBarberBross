package com.barberbross.BarberBross.model;

public class WebSocketPayload<T>{

    private String tipoDoPayload;
    private T dto;

    public WebSocketPayload() {
    }

    public WebSocketPayload(String tipoDoPayload, T dto) {
        this.tipoDoPayload = tipoDoPayload;
        this.dto = dto;
    }

    public WebSocketPayload(String tipoDoPayload) {
        this.tipoDoPayload = tipoDoPayload;
        this.dto = null;
    }

    public String getTipoDoPayload() { return tipoDoPayload; }

    public T getDto() { return dto; }
}
