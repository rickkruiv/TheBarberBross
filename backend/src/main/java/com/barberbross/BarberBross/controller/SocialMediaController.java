package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOSocialMediaRequest;
import com.barberbross.BarberBross.dto.response.DTOSocialMediaResponse;
import com.barberbross.BarberBross.service.SocialMediaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/socialmedias")
public class SocialMediaController {

    @Autowired
    private SocialMediaService socialMediaService;

    @PostMapping
    public ResponseEntity<DTOSocialMediaResponse> salvarSocialMedia(@RequestBody @Valid DTOSocialMediaRequest novaSocialMedia) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(socialMediaService.salvarSocialMedia(novaSocialMedia));
    }

    @GetMapping
    public ResponseEntity<List<DTOSocialMediaResponse>> listarSocialMedias() {
        return ResponseEntity.ok(socialMediaService.listarSocialMedias());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DTOSocialMediaResponse> buscarSocialMediaPorId(@PathVariable Long id) {
        return ResponseEntity.ok(socialMediaService.buscarSocialMediaPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DTOSocialMediaResponse> editarSocialMedia(@PathVariable Long id,
                                                                    @RequestBody @Valid DTOSocialMediaRequest socialMedia) {
        return ResponseEntity.ok(socialMediaService.editarSocialMedia(id, socialMedia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletarSocialMedia(@PathVariable Long id) {
        socialMediaService.deletarSocialMedia(id);
        return ResponseEntity.noContent().build();
    }
}