package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOFornecedorRequest;
import com.barberbross.BarberBross.interfaces.TemEndereco;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "fornecedores")
public class Fornecedor implements TemEndereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fornecedorId;

    @Column(nullable = false)
    private String razaoSocial;

    @Column(nullable = false)
    private String nomeFantasia;

    @Column(nullable = false, length = 18, unique = true)
    private String cnpj;

    @Column(nullable = false, length = 15)
    private String telefone;

    @Column(unique = true)
    private String email;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;

    @OneToOne
    @JoinColumn(name = "usuario_id", unique = true, nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "fornecedor")
    private List<Pedido> pedidos;

    @OneToMany(mappedBy = "fornecedor")
    private List<ItemFornecedor> itensFornecedor;

    @OneToMany(mappedBy = "fornecedor")
    private List<Categoria> categorias;

    //ARRUMAR OS MÉTODOS DESSA CLASSE DPS

    public Fornecedor(DTOFornecedorRequest dto) {
        this.razaoSocial = dto.nome();
        this.nomeFantasia = dto.nome();
        this.cnpj = dto.cnpj();
        this.telefone = dto.telefone();
        this.email = dto.email();
    }

    public Fornecedor() {}
    
    public Long getFornecedorId() { return fornecedorId; }

    public String getRazaoSocial() { return razaoSocial; }

    public String getNomeFantasia() { return nomeFantasia; }

    public String getCnpj() { return cnpj; }

    public String getTelefone() { return telefone; }

    public String getEmail() { return email; }

    public Endereco getEndereco() { return endereco; }

    public Usuario getUsuario() { return usuario; }

    public List<Pedido> getPedidos() { return pedidos; }

    //arrumar esse método dps
    public void atualizarDado(DTOFornecedorRequest dto, Endereco e){
        this.cnpj = dto.cnpj();
        this.email = dto.email();
        this.telefone = dto.telefone();
        this.endereco = e;
    }

    @Override
    public void atualizarEndereco(Endereco e) {
        this.endereco = e;
    }
}
