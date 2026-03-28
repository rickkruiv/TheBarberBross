package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOEstoqueRequest;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "estoques")
public class Estoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long estoqueId;

    @OneToOne
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    @OneToMany(mappedBy = "estoque", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemEstoque> itensEstoque;

    public Estoque(DTOEstoqueRequest dto) { this.itensEstoque = new ArrayList<>(); }
    public Estoque() {}
    
    public Long getEstoqueId() { return estoqueId; }

    public List<ItemEstoque> getItensEstoque() { return itensEstoque; }

}
