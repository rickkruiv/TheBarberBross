package com.barberbross.BarberBross.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "itens_estoque")
public class ItemEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemEstoqueId;

    @ManyToOne
    @JoinColumn(name = "estoque_id")
    private Estoque estoque;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;

    private int quantidade;

    private BigDecimal precoVenda;

    public ItemEstoque() {}

    public ItemEstoque(Long produtosEstoqueId, Produto produto, Estoque estoque, int quantidade, BigDecimal precoVenda) {
        this.produto = produto;
        this.estoque = estoque;
        this.quantidade = quantidade;
        this.precoVenda = precoVenda;
    }

    public Long getItemEstoqueId() { return itemEstoqueId; }

    public Produto getProduto() { return produto; }

    public Estoque getEstoque() { return estoque; }

    public int getQuantidade() { return quantidade; }

    public BigDecimal getPrecoVenda() { return precoVenda; }
}
