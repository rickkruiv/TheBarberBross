package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.config.security.TokenService;
import com.barberbross.BarberBross.dto.request.DTOAutenticacaoRequest;
import com.barberbross.BarberBross.dto.request.DTOClienteRequest;
import com.barberbross.BarberBross.dto.request.DTOFuncionarioRequest;
import com.barberbross.BarberBross.dto.request.DTOUsuarioRequest;
import com.barberbross.BarberBross.dto.response.*;
import com.barberbross.BarberBross.enums.NivelAcesso;
import com.barberbross.BarberBross.exceptions.AccessDeniedException;
import com.barberbross.BarberBross.model.Cliente;
import com.barberbross.BarberBross.model.Funcionario;
import com.barberbross.BarberBross.model.Usuario;
import com.barberbross.BarberBross.repository.UsuarioRepository;
import com.barberbross.BarberBross.validation.implementations.UsuarioCamposUnicosValidator;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private FuncionarioService funcionarioService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioCamposUnicosValidator validator;

    @Autowired
    private UsuarioService usuarioService;

    public DTOLoginResponse fazerLogin(@Valid DTOAutenticacaoRequest dto) {
        var usernameSenha = new UsernamePasswordAuthenticationToken(dto.username(), dto.senha());
        var auth = authenticationManager.authenticate(usernameSenha);
        Usuario u = (Usuario) auth.getPrincipal();
        var token = tokenService.gerarToken(u);

        if (u.getNivelAcesso().equals(NivelAcesso.COLABORADOR) || u.getNivelAcesso().equals(NivelAcesso.ADMIN)){
            if (u.getFuncionario() == null){
                return new DTOLoginResponse(u.getUsuarioId(), null, null, null,
                        u.getUsername(), u.getNivelAcesso(), token);
            }

            Funcionario f = funcionarioService.buscarFuncionarioPorUserId(u.getUsuarioId());

            if (f.getAtivo()) {
                return new DTOLoginResponse(u.getUsuarioId(), f.getFuncionarioId(), null, f.getEmpresa().getEmpresaId(),
                        u.getUsername(), u.getNivelAcesso(), token);
            } else {
                throw new AccessDeniedException("Funcionário está invativo.");
            }
        }

        return new DTOLoginResponse(u.getUsuarioId(), null, u.getCliente().getClienteId(), null,
                u.getUsername(), u.getNivelAcesso(), token);
    }

    public DTOClienteResponse fazerRegistroCliente(@Valid DTOClienteRequest dto) {
        return clienteService.salvarCliente(dto);
    }

    public DTOFuncionarioResponse fazerRegistroFuncionario(@Valid DTOFuncionarioRequest dto) {
        return funcionarioService.salvarFuncionario(dto);
    }

    public DTOUsuarioResponse fazerRegistroBarbeiro(@Valid DTOUsuarioRequest dto) {
        return usuarioService.salvarUsuario(dto);
    }
}
