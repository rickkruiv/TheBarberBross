package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOSocialMediaRequest;
import com.barberbross.BarberBross.dto.response.DTOSocialMediaResponse;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Empresa;
import com.barberbross.BarberBross.model.SocialMedia;
import com.barberbross.BarberBross.repository.EmpresaRepository;
import com.barberbross.BarberBross.repository.SocialMediaRepository;
import com.barberbross.BarberBross.validation.implementations.SocialMediaCamposUnicosValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SocialMediaService {

    @Autowired
    private SocialMediaRepository socialMediaRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private SocialMediaCamposUnicosValidator validator;

    public DTOSocialMediaResponse salvarSocialMedia(DTOSocialMediaRequest dto) {
        validator.validar(dto);
        Empresa e = empresaRepository.findById(dto.empresaId())
                .orElseThrow(() -> new NotFoundException("Nenhuma empresa encontrada com id: " + dto.empresaId()));

        SocialMedia sm = new SocialMedia(dto, e);
        socialMediaRepository.save(sm);
        return new DTOSocialMediaResponse(sm);
    }

    public List<DTOSocialMediaResponse> listarSocialMedias() {
        return socialMediaRepository.findAll()
                .stream()
                .map(DTOSocialMediaResponse::new)
                .toList();
    }

    public DTOSocialMediaResponse buscarSocialMediaPorId(Long id) {
        SocialMedia sm = buscarSocialMedia(id);
        return new DTOSocialMediaResponse(sm);
    }

    public DTOSocialMediaResponse editarSocialMedia(Long id, DTOSocialMediaRequest dto) {
        SocialMedia smAtual = buscarSocialMedia(id);

        if (!smAtual.getUrl().equals(dto.url())){
            validator.validar(dto);
        }

        smAtual.atualizarDados(dto);
        socialMediaRepository.save(smAtual);
        return new DTOSocialMediaResponse(smAtual);
    }

    public void deletarSocialMedia(Long id) {
        SocialMedia sm = buscarSocialMedia(id);
        socialMediaRepository.delete(sm);
    }

    private SocialMedia buscarSocialMedia(Long id){
        return socialMediaRepository.findById(id).
                orElseThrow(() -> new NotFoundException("Nenhuma rede social encontrada com id: " + id));
    }
}