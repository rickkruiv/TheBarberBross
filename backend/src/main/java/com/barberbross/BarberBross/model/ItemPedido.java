package com.barberbross.BarberBross.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "itens_pedido")
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemPedidoId;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;

    private int quantidade;

    private BigDecimal valorUnitario;

    private BigDecimal valorTotal;

    public ItemPedido() {}

    public ItemPedido(Long itemPedidoId, Pedido pedido, Produto produto, int quantidade, BigDecimal valorTotal) {
        this.itemPedidoId = itemPedidoId;
        this.pedido = pedido;
        this.produto = produto;
        this.quantidade = quantidade;
        this.valorTotal = valorTotal;
    }

    public Long getItemPedidoId() { return itemPedidoId; }

    public Pedido getPedido() { return pedido; }

    public Produto getProduto() { return produto; }

    public int getQuantidade() { return quantidade; }

    public BigDecimal getValorTotal() { return valorTotal; }
}
