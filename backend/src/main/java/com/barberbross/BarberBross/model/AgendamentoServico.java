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

    public AgendamentoServico(Long agendamentosServicosId, Agendamento agendamento, Servico servico) {
        this.agendamentosServicosId = agendamentosServicosId;
        this.agendamento = agendamento;
        this.servico = servico;
    }

    public Long getAgendamentosServicosId() { return agendamentosServicosId; }

    public Agendamento getAgendamento() { return agendamento; }

    public Servico getServico() { return servico; }
}
