package com.barberbross.BarberBross.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "itens_estoque")
public class ItemEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @ManyToOne
    private Estoque estoque;

    @ManyToOne
    private Produto produto;

    private Integer quantidade;

    private LocalDateTime dataEntrada;

    private LocalDateTime dataSaida;

    public ItemEstoque(Estoque estoque, Produto produto, Integer quantidade) {
        this.estoque = estoque;
        this.produto = produto;
        this.quantidade = quantidade;
        this.dataEntrada = LocalDateTime.now();
    }

    public Long getItemId() {return itemId; }

    public Estoque getEstoque() { return estoque; }

    public Produto getProduto() { return produto; }

    public Integer getQuantidade() { return quantidade; }

    public LocalDateTime getDataEntrada() { return dataEntrada; }

    public LocalDateTime getDataSaida() { return dataSaida; }
}
