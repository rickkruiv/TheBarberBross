package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOAvaliacaoRequest;
import jakarta.persistence.*;

import java.math.BigDecimal;
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

    @OneToOne
    @JoinColumn(name = "agendamento_id", nullable = false, unique = true)
    private Agendamento agendamento;

    @ManyToOne
    @JoinColumn(name = "funcionario_id", nullable = false)
    private Funcionario funcionario;

    @Column(nullable = false)
    private BigDecimal nota;

    private String comentario;

    @Column(nullable = false)
    private LocalDateTime data;

    public Avaliacao() {}

    public Avaliacao(DTOAvaliacaoRequest dto, Cliente c, Empresa e, Agendamento a) {
        this.cliente = c;
        this.empresa = e;
        this.agendamento = a;
        this.nota = dto.avaliacao();
        this.comentario = dto.comentario();
        this.data = LocalDateTime.now();
    }

    public Long getAvaliacaoId() { return avaliacaoId; }

    public Cliente getCliente() { return cliente; }

    public Empresa getEmpresa() { return empresa; }

    public Agendamento getAgendamento() { return agendamento; }

    public Funcionario getFuncionario() { return funcionario; }

    public BigDecimal getNota() { return nota; }

    public String getComentario() { return comentario; }

    public LocalDateTime getData() { return data; }

    public void atualizarDados(DTOAvaliacaoRequest dto) {
        this.nota = dto.avaliacao();
        this.comentario = dto.comentario();
    }
}