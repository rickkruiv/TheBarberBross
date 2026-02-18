package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOCategoriaRequest;
import com.barberbross.BarberBross.enums.TipoProdServ;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categorias")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoriaId;

    @Column(nullable = false, length = 50)
    private String nome;

    @Column(length = 100)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoProdServ tipo;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Servico> servicos; //sera q precisa disso aqui?

    public Categoria() {}

    public Categoria(DTOCategoriaRequest dto) {
        this.nome = dto.nome();
        this.descricao = dto.descricao();
        this.tipo = dto.tipo();
        this.servicos = new ArrayList<>();
    }

    public Long getCategoriaId() { return categoriaId; }

    public String getNome() { return nome; }

    public String getDescricao() { return descricao; }

    public TipoProdServ getTipo() { return tipo; }

    public void atualizarDado(DTOCategoriaRequest dto) {
        this.nome = dto.nome();
        this.descricao = dto.descricao();
        this.tipo = dto.tipo();
    }
}
