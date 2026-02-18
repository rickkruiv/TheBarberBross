package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOServicoRequest;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "servicos")
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long servicoId;

    @Column(length = 50, nullable = false)
    private String nome;

    @Column(length = 100)
    private String descricao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoriaId", nullable = false)
    private Categoria categoria;

    @Column(nullable = false)
    private double preco;

    @Column(nullable = false)
    private int duracao;

    @ManyToMany(mappedBy = "servicos", fetch = FetchType.LAZY)
    private List<Agendamento> agendamentos = new ArrayList<>();

    public Servico(DTOServicoRequest dto, Categoria c) {
        this.nome = dto.nome();
        this.descricao = dto.descricao();
        this.categoria = c;
        this.preco = dto.preco();
        this.duracao = dto.duracao();
        this.agendamentos = new ArrayList<>();
    }

    public Servico() {}
    
    public Long getServicoId() { return servicoId; }

    public String getNome() { return nome; }

    public String getDescricao() { return descricao; }

    public Categoria getCategoria() { return categoria; }

    public double getPreco() { return preco; }

    public List<Agendamento> getAgendamentos() { return agendamentos; }
    public void setAgendamentos(List<Agendamento> agendamentos) { this.agendamentos = agendamentos; }

    public int getDuracao() { return duracao; }

    public void atualizarDados(DTOServicoRequest dto, Categoria c) {
        this.nome = dto.nome();
        this.descricao = dto.descricao();
        this.categoria = c;
        this.preco = dto.preco();
        this.duracao = dto.duracao();
        this.agendamentos = new ArrayList<>();
    }
}
