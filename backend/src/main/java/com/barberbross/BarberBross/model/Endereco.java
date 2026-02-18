package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOEnderecoRequest;
import jakarta.persistence.*;

@Entity
@Table(name = "enderecos")
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long enderecoId;

    @Column(nullable = false, length = 9)
    private String cep;

    @Column(nullable = false)
    private String logradouro;

    private String complemento;

    @Column(nullable = false)
    private String numero;

    @Column(nullable = false)
    private String cidade;

    @Column(nullable = false)
    private String bairro;

    @Column(nullable = false, length = 2)
    private String uf;

    public Endereco() {}

    public Endereco(DTOEnderecoRequest dto) {
        this.cep = dto.cep();
        this.logradouro = dto.logradouro();
        this.complemento = dto.complemento();
        this.numero = dto.numero();
        this.cidade = dto.cidade();
        this.bairro = dto.bairro();
        this.uf = dto.uf();
    }

    public Long getEnderecoId() { return enderecoId; }

    public String getCep() { return cep; }

    public String getLogradouro() { return logradouro; }

    public String getNumero() { return numero; }

    public String getComplemento() { return complemento; }

    public String getBairro() { return bairro; }

    public String getCidade() { return cidade; }

    public String getUf() { return uf; }

    public void atualizarDados(DTOEnderecoRequest dto){
        this.cep = dto.cep();
        this.logradouro = dto.logradouro();
        this.complemento = dto.complemento();
        this.numero = dto.numero();
        this.cidade = dto.cidade();
        this.bairro = dto.bairro();
        this.uf = dto.uf();
    }

}