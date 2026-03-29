package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.enums.Status;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pedidoId;

    @Column(nullable = false)
    private LocalDate data;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    @ManyToOne
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itensPedido;

    @OneToMany(mappedBy = "pedido",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pagamento> pagamento;

    public Pedido() {}

    //criar DTO de pedido dps
    public Pedido(Long pedidoId, LocalDate data, Status status, Empresa empresa, Fornecedor fornecedor, List<Produto> produtos) {
        this.pedidoId = pedidoId;
        this.data = data;
        this.status = status;
        this.empresa = empresa;
        this.fornecedor = fornecedor;
        this.itensPedido = new ArrayList<>();
    }

    public Long getPedidoId() { return pedidoId; }

    public LocalDate getData() { return data; }

    public Status getStatus() { return status; }

    public Empresa getEmpresa() { return empresa; }

    public Fornecedor getFornecedor() { return fornecedor; }

    public List<ItemPedido> getItensPedido() { return itensPedido; }


    //criar método de add produtos

}
