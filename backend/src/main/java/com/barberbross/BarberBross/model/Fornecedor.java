package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOFornecedorRequest;
import com.barberbross.BarberBross.interfaces.TemEndereco;
import jakarta.persistence.*;

@Entity
@Table(name = "fornecedores")
public class Fornecedor implements TemEndereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fornecedorId;

    private String nome;

    @Column(length = 18, unique = true)
    private String cnpj;

    @Column(length = 15)
    private String telefone;

    @Column(unique = true)
    private String email;

    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;

    public Fornecedor(DTOFornecedorRequest dto) {
        this.nome = dto.nome();
        this.cnpj = dto.cnpj();
        this.telefone = dto.telefone();
        this.email = dto.email();
    }

    public Fornecedor() {}
    
    public Long getFornecedorId() { return fornecedorId; }

    public String getNome() { return nome; }

    public String getCnpj() { return cnpj; }

    public String getTelefone() { return telefone; }

    public String getEmail() { return email; }

    public Endereco getEndereco() { return endereco; }

    public void atualizarDado(DTOFornecedorRequest dto, Endereco e){
        this.cnpj = dto.cnpj();
        this.email = dto.email();
        this.nome = dto.nome();
        this.telefone = dto.telefone();
        this.endereco = e;
    }

    @Override
    public void atualizarEndereco(Endereco e) {
        this.endereco = e;
    }
}
