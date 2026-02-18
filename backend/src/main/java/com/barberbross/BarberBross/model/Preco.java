package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOPrecoRequest;
import com.barberbross.BarberBross.enums.TipoProdServ;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "precos")
public class Preco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long precoId;

    @Column(nullable = false)
    private LocalDateTime dataInicio;

    @Column(nullable = false)
    private LocalDateTime dataFim;

    @Column(nullable = false)
    private double valor;

    @Enumerated(EnumType.STRING)
    private TipoProdServ tipo;

    private String descricao;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Agendamento> agendamentos = new ArrayList<>();

    public Preco(DTOPrecoRequest dto) {
        this.dataInicio = dto.dataInicio();
        this.dataFim = dto.dataFim();
        this.valor = dto.valor();
        this.tipo = dto.tipo();
        this.descricao = dto.descricao();
        this.agendamentos = new ArrayList<>();
    }

    public Preco() {}

    public Long getPrecoId() { return precoId; }

    public LocalDateTime getDataInicio() { return dataInicio; }

    public double getValor() { return valor; }

    public String getDescricao() { return descricao; }

    public LocalDateTime getDataFim() { return dataFim; }

    public TipoProdServ getTipo() { return tipo ;}
}