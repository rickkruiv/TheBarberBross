package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOClienteRequest;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clienteId;

    @Column(length = 50, nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(length = 15, nullable = false)
    private String telefone;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<Agendamento> agendamentos;

    public Cliente() {}

    public Cliente(DTOClienteRequest c, Usuario u) {
        this.nome = c.nome();
        this.email = c.email();
        this.telefone = c.telefone();
        this.usuario = u;
        this.agendamentos = new ArrayList<>();
    }

    public Long getClienteId() { return clienteId; }

    public List<Agendamento> getAgendamentos() { return agendamentos; }

    public String getNome() { return nome; }

    public String getEmail() { return email; }

    public String getTelefone() { return telefone; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public void atualizarDados(DTOClienteRequest dto) {
        this.email = dto.email();
        this.nome = dto.nome();
        this.telefone = dto.telefone();
    }
}