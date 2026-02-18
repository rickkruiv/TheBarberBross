package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOAgendamentoRequest;
import com.barberbross.BarberBross.enums.Status;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "agendamentos")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long agendamentoId;

    @Column(nullable = false)
    private LocalDateTime dataHorario;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(length = 100)
    private String observacao;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(
        name = "servico_agendamento",
        joinColumns = @JoinColumn(name = "agendamentoId"),
        inverseJoinColumns = @JoinColumn(name = "servicoId")
    )
    private List<Servico> servicos;

    @Column(nullable = false)
    private double valorTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionario;

    public Agendamento() {}

    public Agendamento(DTOAgendamentoRequest dto, Cliente c, Empresa e, Funcionario f) {
        this.dataHorario = dto.dataHorario();
        this.status = Status.PENDENTE;
        this.observacao = dto.observacao();
        this.cliente = c;
        this.empresa = e;
        this.funcionario = f;
        this.servicos = new ArrayList<>();
    }

    public Long getAgendamentoId() { return agendamentoId; }

    public LocalDateTime getDataHorario() { return dataHorario; }

    public Cliente getCliente() { return cliente; }

    public Empresa getEmpresa() { return empresa; }

    public Status getStatus() { return status; }

    public void setStatus(Status status) { this.status = status;}

    public String getObservacao() { return observacao; }

    public double getValorTotal() { return valorTotal; }

    public Funcionario getFuncionario() { return funcionario; }

    public List<Servico> getServicos() { return servicos; }

    public void adicionarServico(Servico s){
        this.servicos.add(s);
        this.valorTotal += s.getPreco();
    }

    public void limparServicos() {
        this.servicos.clear();
        this.valorTotal = 0.0;
    }

    public void atualizarDados(DTOAgendamentoRequest agendamento, Funcionario funcionario) {
        this.status = Status.PENDENTE;
        this.dataHorario = agendamento.dataHorario();
        this.observacao = agendamento.observacao();
        this.funcionario = funcionario;
    }

}