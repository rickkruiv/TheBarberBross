package com.barberbross.BarberBross.dto.response;

import com.barberbross.BarberBross.model.SocialMedia;

public record DTOSocialMediaResponse(
        Long socialMediaId,
        String url,
        Long empresaId) {

    public DTOSocialMediaResponse(SocialMedia sm) {
        this(sm.getSocialMediaId(), sm.getUrl(), sm.getEmpresa().getEmpresaId());
    }
}
