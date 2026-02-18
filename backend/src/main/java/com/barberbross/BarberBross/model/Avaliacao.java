package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOAvaliacaoRequest;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "avaliacoes")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long avaliacaoId;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @ManyToOne
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;

    @Column(nullable = false)
    private Integer avaliacao;

    private String comentario;

    @Column(nullable = false)
    private LocalDateTime data;

    public Avaliacao() {}

    public Avaliacao(DTOAvaliacaoRequest dto, Cliente c, Empresa e, Servico s) {
        this.cliente = c;
        this.empresa = e;
        this.servico = s;
        this.avaliacao = dto.avaliacao();
        this.comentario = dto.comentario();
        this.data = LocalDateTime.now();
    }

    public Long getAvaliacaoId() { return avaliacaoId; }

    public Cliente getCliente() { return cliente; }

    public Empresa getEmpresa() { return empresa; }

    public Servico getServico() { return servico;}

    public Integer getAvaliacao() { return avaliacao; }

    public String getComentario() { return comentario; }

    public LocalDateTime getData() { return data; }

    public void atualizarDados(DTOAvaliacaoRequest dto) {
        this.avaliacao = dto.avaliacao();
        this.comentario = dto.comentario();
    }
}