package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOProdutoRequest;
import jakarta.persistence.*;

@Entity
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long produtoId;

    @Column(nullable = false)
    private String nome;

    private String descricao;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    public Produto(DTOProdutoRequest dto, Categoria c) {
        this.nome = dto.nome();
        this.descricao = dto.descricao();
        this.categoria = c;
    }

    public Produto() {}
    
    public Long getProdutoId() { return produtoId; }

    public String getNome() { return nome; }

    public String getDescricao() { return descricao; }

    public Categoria getCategoria() { return categoria; }

    public void atualizarDados(DTOProdutoRequest dto, Categoria c){
        this.nome = dto.nome();
        this.descricao = dto.descricao();
        this.categoria = c;
    }
}