package com.barberbross.BarberBross.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "itens_fornecedor")
public class ItemFornecedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemFornecedorId;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;

    private BigDecimal precoFornecedor;

    public ItemFornecedor() {}

    public ItemFornecedor(Long produtoFornecedorId, Produto produto, Fornecedor fornecedor, BigDecimal precoFornecedor) {
        this.itemFornecedorId = produtoFornecedorId;
        this.produto = produto;
        this.fornecedor = fornecedor;
        this.precoFornecedor = precoFornecedor;
    }

    public Long getItemFornecedorId() { return itemFornecedorId; }

    public Produto getProduto() { return produto; }

    public Fornecedor getFornecedor() { return fornecedor; }

    public BigDecimal getPrecoFornecedor() { return precoFornecedor; }
}
