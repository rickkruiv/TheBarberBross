package com.barberbross.BarberBross.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "agendamentos_servicos")
public class AgendamentoServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long agendamentosServicosId;

    @ManyToOne
    @JoinColumn(name = "agendamento_id")
    private Agendamento agendamento;

    @ManyToOne
    @JoinColumn(name = "servico_id")
    private Servico servico;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(nullable = false)
    private Integer duracao;

    public AgendamentoServico() {}

    public AgendamentoServico(Agendamento agendamento, Servico servico) {
        this.agendamento = agendamento;
        this.servico = servico;
        this.preco = servico.getPreco();
        this.duracao = servico.getDuracao();
    }

    public Long getAgendamentosServicosId() { return agendamentosServicosId; }

    public Agendamento getAgendamento() { return agendamento; }

    public Servico getServico() { return servico; }

    public BigDecimal getPreco() { return preco; }

    public Integer getDuracao() { return duracao; }

    public Long getServicoId() { return servico.getServicoId(); }
}
