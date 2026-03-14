package com.barberbross.BarberBross.controller;

import com.barberbross.BarberBross.dto.request.DTOAutenticacaoRequest;
import com.barberbross.BarberBross.dto.request.DTOClienteRequest;
import com.barberbross.BarberBross.dto.request.DTOFuncionarioRequest;
import com.barberbross.BarberBross.dto.response.DTOClienteResponse;
import com.barberbross.BarberBross.dto.response.DTOFuncionarioResponse;
import com.barberbross.BarberBross.dto.response.DTOFuncionarioSimplesResponse;
import com.barberbross.BarberBross.service.AutenticacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity login(@RequestBody @Valid DTOAutenticacaoRequest dto){
        return autenticacaoService.fazerLogin(dto);
    }

    @PostMapping("/registrar/cliente")
    public ResponseEntity<DTOClienteResponse> registrarCliente(@RequestBody @Valid DTOClienteRequest dto){
        return autenticacaoService.fazerRegistroCliente(dto);
    }

    @PostMapping("/admin/registrar/funcionario") //esse response é só pra teste lembrar de mudar para o normal dps pelo amor de Deus!!!!!!
    public ResponseEntity<DTOFuncionarioSimplesResponse> registrarFuncionario(@RequestBody @Valid DTOFuncionarioRequest dto){
        return autenticacaoService.fazerRegistroFuncionario(dto);
    }

}
