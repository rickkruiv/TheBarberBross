package com.barberbross.BarberBross.model;

import com.barberbross.BarberBross.dto.request.DTOSocialMediaRequest;
import jakarta.persistence.*;

@Entity
@Table(name = "redes_sociais")
public class SocialMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long socialMediaId;

    @Column(nullable = false)
    private String url;

    @ManyToOne
    @JoinColumn(name = "empresaId", nullable = false)
    private Empresa empresa;

    public SocialMedia(DTOSocialMediaRequest dto, Empresa e) {
        this.url = dto.url();
        this.empresa = e;
    }

    public SocialMedia() {}
    
    public Long getSocialMediaId() { return socialMediaId; }

    public String getUrl() { return url; }

    public Empresa getEmpresa() { return empresa; }

    public void atualizarDados(DTOSocialMediaRequest dto){
        this.url = dto.url();
    }
}