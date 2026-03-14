package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.config.security.TokenService;
import com.barberbross.BarberBross.dto.request.DTOAutenticacaoRequest;
import com.barberbross.BarberBross.dto.request.DTOClienteRequest;
import com.barberbross.BarberBross.dto.request.DTOFuncionarioRequest;
import com.barberbross.BarberBross.dto.response.DTOClienteResponse;
import com.barberbross.BarberBross.dto.response.DTOFuncionarioSimplesResponse;
import com.barberbross.BarberBross.dto.response.DTOLoginResponse;
import com.barberbross.BarberBross.model.Usuario;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private FuncionarioService funcionarioService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public ResponseEntity fazerLogin(@Valid DTOAutenticacaoRequest dto) {
        var usernameSenha = new UsernamePasswordAuthenticationToken(dto.username(), dto.senha());
        var auth = authenticationManager.authenticate(usernameSenha);
        Usuario u = (Usuario) auth.getPrincipal();
        var token = tokenService.gerarToken(u);
        return ResponseEntity.ok(new DTOLoginResponse(u.getUsuarioId(), u.getUsername(), u.getNivelAcesso(), token));
    }

    public ResponseEntity<DTOClienteResponse> fazerRegistroCliente(@Valid DTOClienteRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.salvarCliente(dto));
    }

    public ResponseEntity<DTOFuncionarioSimplesResponse> fazerRegistroFuncionario(@Valid DTOFuncionarioRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(funcionarioService.salvarFuncionario(dto));
    }
}
