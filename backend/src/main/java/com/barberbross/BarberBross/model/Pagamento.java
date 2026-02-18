package com.barberbross.BarberBross.model;


import com.barberbross.BarberBross.dto.request.DTOPagamentoRequest;
import com.barberbross.BarberBross.enums.FormaPagamento;
import com.barberbross.BarberBross.enums.Status;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pagamentos")
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pagamentoId;

    @ManyToOne
    @JoinColumn(name = "agendamento_agendamento_id")
    private Agendamento agendamento;

    private double valor;

    private LocalDateTime dataPagamento;

    private FormaPagamento formaPagamento;

    @Enumerated(EnumType.STRING)
    private Status status;

    public Pagamento(DTOPagamentoRequest dto, Agendamento a) {
        this.agendamento = a;
        this.valor = dto.valor();
        this.dataPagamento = dto.dataPagamento();
        this.formaPagamento = dto.formaPagamento();
        this.status = Status.PENDENTE;
    }

    public Pagamento() {}

    public Long getPagamentoId() { return pagamentoId; }

    public Agendamento getAgendamento() { return agendamento; }

    public double getValor() { return valor; }

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
