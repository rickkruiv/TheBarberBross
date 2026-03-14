package com.barberbross.BarberBross.enums;

public enum NivelAcesso {
    ADMIN("admin"),
    COLABORADOR("colaborador"),
    CLIENTE("cliente");

    private String nivelAcesso;

    NivelAcesso(String nivelAcesso) {
        this.nivelAcesso = nivelAcesso;
    }
}
