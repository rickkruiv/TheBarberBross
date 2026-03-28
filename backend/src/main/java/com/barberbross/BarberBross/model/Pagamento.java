package com.barberbross.BarberBross.model;


import com.barberbross.BarberBross.dto.request.DTOPagamentoRequest;
import com.barberbross.BarberBross.enums.FormaPagamento;
import com.barberbross.BarberBross.enums.Status;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagamentos")
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pagamentoId;

    @Column(nullable = false)
    private LocalDateTime dataPagamento;

    @Column(nullable = false)
    private BigDecimal valor;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Enumerated(EnumType.STRING)
    private FormaPagamento formaPagamento;

    @ManyToOne
    @JoinColumn(name = "agendamento_id")
    private Agendamento agendamento;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    //se pa dps vão ter outros atributos para conexão com alguma API de pagamento

    //dps pensar na lógica dessa classe!!!!!

    public Pagamento(DTOPagamentoRequest dto, Agendamento a) {
        this.agendamento = a;
        this.dataPagamento = dto.dataPagamento();
        this.formaPagamento = dto.formaPagamento();
        this.status = Status.PENDENTE;
    }

    public Pagamento() {}

    public Long getPagamentoId() { return pagamentoId; }

    public Agendamento getAgendamento() { return agendamento; }

    public BigDecimal getValor() { return valor; }

    public LocalDateTime getDataPagamento() { return dataPagamento; }

    public FormaPagamento getFormaPagamento() { return formaPagamento; }

    public Status getStatus() { return status; }

    public void cancelarPagamento() {
        this.status = Status.CANCELADO;
    }

    public void efetuarPagamento() {
        this.status = Status.CONCLUIDO;
    }
}
