package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOAgendamentoRequest;
import com.barberbross.BarberBross.enums.Status;
import jakarta.persistence.*;

import java.math.BigDecimal;
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

    @OneToMany(mappedBy = "agendamento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AgendamentoServico> servicos;

    @Column(nullable = false)
    private BigDecimal valorTotal;

    @Column(nullable = false)
    private Integer duracaoTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_id", nullable = false)
    private Funcionario funcionario;

    @OneToOne(mappedBy = "agendamento", cascade = CascadeType.ALL)
    private Avaliacao avaliacao;

    @OneToMany(mappedBy = "agendamento")
    private List<Pagamento> pagamentos;

    public Agendamento() {}

    public Agendamento(DTOAgendamentoRequest dto, Cliente c, Empresa e, Funcionario f) {
        this.dataHorario = dto.dataHorario();
        this.status = Status.PENDENTE;
        this.observacao = dto.observacao();
        this.cliente = c;
        this.empresa = e;
        this.funcionario = f;
        this.duracaoTotal = 0;
        this.valorTotal = BigDecimal.ZERO;
        this.servicos = new ArrayList<>();
    }

    public Long getAgendamentoId() { return agendamentoId; }

    public LocalDateTime getDataHorario() { return dataHorario; }

    public Cliente getCliente() { return cliente; }

    public Empresa getEmpresa() { return empresa; }

    public Status getStatus() { return status; }

    public void setStatus(Status status) { this.status = status;}

    public String getObservacao() { return observacao; }

    public BigDecimal getValorTotal() { return valorTotal; }

    public Funcionario getFuncionario() { return funcionario; }

    public List<AgendamentoServico> getServicos() { return servicos; }

    public Integer getDuracaoTotal() { return duracaoTotal; }

    public Avaliacao getAvaliacao() { return avaliacao; }

    public void adicionarServico(Servico s){
        AgendamentoServico as = new AgendamentoServico(this, s);
        this.servicos.add(as);
        calcularDuracaoTotal();
        recalcularValorTotal();
    }

    public void recalcularValorTotal() {
        this.valorTotal = this.servicos.stream()
                .map(AgendamentoServico::getPreco)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void limparServicos() {
        this.servicos.clear();
        this.valorTotal = BigDecimal.ZERO;
    }

    public void atualizarDados(DTOAgendamentoRequest agendamento, Funcionario funcionario) {
        this.status = Status.PENDENTE;
        this.dataHorario = agendamento.dataHorario();
        this.observacao = agendamento.observacao();
        this.funcionario = funcionario;
    }

    public void calcularDuracaoTotal(){
        this.duracaoTotal = this.servicos.stream()
                .map(AgendamentoServico::getDuracao)
                .reduce(0, Integer::sum);
    }

}