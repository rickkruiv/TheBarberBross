package com.barberbross.BarberBross.validation.implementations;

import com.barberbross.BarberBross.dto.request.DTOSocialMediaRequest;
import com.barberbross.BarberBross.exceptions.ConflictException;
import com.barberbross.BarberBross.repository.SocialMediaRepository;
import com.barberbross.BarberBross.validation.interfaces.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SocialMediaCamposUnicosValidator implements Validator<DTOSocialMediaRequest> {

    @Autowired
    private SocialMediaRepository repository;

    @Override
    public void validar(DTOSocialMediaRequest dto) {
        boolean jaExiste = repository.existsByUrl(dto.url());

        if (jaExiste){
            throw new ConflictException("Url já cadastrada para outra SocialMedia.");
        }
    }
}