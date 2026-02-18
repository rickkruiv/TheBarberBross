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

    @OneToMany(mappedBy = "estoque", cascade = CascadeType.ALL)
    private List<ItemEstoque> produtos;

    public Estoque(DTOEstoqueRequest dto) { this.produtos = new ArrayList<>(); }
    public Estoque() {}
    
    public Long getEstoqueId() { return estoqueId; }

    public List<ItemEstoque> getProdutos() { return produtos; }

    public void adicionarProduto(Produto p, Integer qtd){
        ItemEstoque item = new ItemEstoque(this, p, qtd);
        produtos.add(item);
    }
}
