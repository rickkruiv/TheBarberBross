package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.response.DTOEnderecoResponse;
import com.barberbross.BarberBross.service.EnderecoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/enderecos")
public class EnderecoController { //se pa isso aqui tem que deixar de existir

    @Autowired
    private EnderecoService enderecoService;

    @GetMapping
    public ResponseEntity<List<DTOEnderecoResponse>> listarEnderecos(){
        return ResponseEntity.ok(enderecoService.listarEnderecos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DTOEnderecoResponse> buscarEnderecoPorId(@PathVariable Long id){
        return ResponseEntity.ok(enderecoService.buscarEnderecoPorId(id));
    }

}