package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOAutenticacaoRequest;
import com.barberbross.BarberBross.dto.request.DTOClienteRequest;
import com.barberbross.BarberBross.dto.request.DTOFuncionarioRequest;
import com.barberbross.BarberBross.dto.response.DTOClienteResponse;
import com.barberbross.BarberBross.dto.response.DTOFuncionarioSimplesResponse;
import com.barberbross.BarberBross.dto.response.DTOLoginResponse;
import com.barberbross.BarberBross.service.AutenticacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {

    @Autowired
    private AutenticacaoService autenticacaoService;

    @PostMapping("/login")
    public ResponseEntity<DTOLoginResponse> login(@RequestBody @Valid DTOAutenticacaoRequest dto){
        return ResponseEntity.ok(autenticacaoService.fazerLogin(dto));
    }

    @PostMapping("/registrar/cliente")
    public ResponseEntity<DTOClienteResponse> registrarCliente(@RequestBody @Valid DTOClienteRequest dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(autenticacaoService.fazerRegistroCliente(dto));
    }

    @PostMapping("/admin/registrar/funcionario") //esse response é só pra teste lembrar de mudar para o normal dps pelo amor de Deus!!!!!!
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DTOFuncionarioSimplesResponse> registrarFuncionario(@RequestBody @Valid DTOFuncionarioRequest dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(autenticacaoService.fazerRegistroFuncionario(dto));
    }

}
