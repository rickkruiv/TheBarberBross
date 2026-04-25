package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOClienteRequest;
import com.barberbross.BarberBross.dto.request.DTOUsuarioRequest;
import com.barberbross.BarberBross.dto.response.DTOAgendamentoResponse;
import com.barberbross.BarberBross.dto.response.DTOClienteResponse;
import com.barberbross.BarberBross.enums.NivelAcesso;
import com.barberbross.BarberBross.exceptions.AccessDeniedException;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Cliente;
import com.barberbross.BarberBross.model.Usuario;
import com.barberbross.BarberBross.repository.AgendamentoRepository;
import com.barberbross.BarberBross.repository.ClienteRepository;
import com.barberbross.BarberBross.repository.UsuarioRepository;
import com.barberbross.BarberBross.validation.implementations.AuthorizationValidator;
import com.barberbross.BarberBross.validation.implementations.ClienteCamposUnicosValidator;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ClienteCamposUnicosValidator validator;

    @Autowired
    private AuthenticatedUserService authUser;

    @Autowired
    private AuthorizationValidator authValidation;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    public DTOClienteResponse salvarCliente(DTOClienteRequest dto) {
        validator.validar(dto);

        String senhaEncriptada = new BCryptPasswordEncoder().encode(dto.senha());
        Usuario u = new Usuario(dto, senhaEncriptada);
        usuarioRepository.save(u);

        Cliente c = new Cliente(dto, u);
        clienteRepository.save(c);

        return new DTOClienteResponse(c);
    }

    public List<DTOClienteResponse> listarClientes() { //só pra dev
        return clienteRepository.findAll()
                .stream()
                .map(DTOClienteResponse::new)
                .toList();
    }

    public DTOClienteResponse buscarCliente(String clienteNome) {
        Cliente c = buscarClientePorNome(clienteNome);
        return new DTOClienteResponse(c);
    }

    public List<DTOAgendamentoResponse> buscarAgendamentos(Long id) {
        authValidation.validarClienteUsuario(authUser.get(), id);
        return agendamentoRepository.buscarAgendamentoPorCliente(id)
                .stream()
                .map(DTOAgendamentoResponse::new)
                .toList();
    }

    public DTOClienteResponse editarCliente(Long id, DTOClienteRequest clienteEditado) {
        if ((authUser.isColaborador() || authUser.isFornecedor())){
            throw new AccessDeniedException("Usuário não tem permissão para alterar este cliente");
        } else {
            authValidation.validarClienteUsuario(authUser.get(), id);
        }

        validator.validar(clienteEditado, id);

        Cliente c = buscarClientePorId(id);
        c.atualizarDados(clienteEditado);

        Usuario u = usuarioRepository.findById(authUser.get().getUserId())
                        .orElseThrow(() -> new NotFoundException("Nenhum Usuário encontrado"));
        DTOUsuarioRequest usuarioEditado = new DTOUsuarioRequest(clienteEditado.email(), clienteEditado.senha(), NivelAcesso.CLIENTE);
        String senhaHash = new BCryptPasswordEncoder().encode(usuarioEditado.senha());
        u.atualizarDados(usuarioEditado, senhaHash);

        usuarioRepository.save(u);
        clienteRepository.save(c);
        return new DTOClienteResponse(c);
    }

    public void deletarCliente(Long id) {
        if ((authUser.isColaborador() || authUser.isFornecedor())){
            throw new AccessDeniedException("Usuário não tem permissão para alterar este cliente");
        } else {
            authValidation.validarClienteUsuario(authUser.get(), id);
        }
        Cliente c = buscarClientePorId(id);
        Usuario u = usuarioRepository.findById(c.getUsuario().getUsuarioId())
                .orElseThrow(() -> new NotFoundException("Nenhum Usuário encontrado."));

        clienteRepository.delete(c);
        usuarioRepository.delete(u);
    }

    protected Cliente buscarClientePorId(Long id) {
        return clienteRepository.findById(id).
                orElseThrow(() -> new NotFoundException("Nenhum cliente encontrado com esse id: " + id));
    }

    protected Cliente buscarClientePorNome(String nome) {
        return clienteRepository.findByNome(nome).
                orElseThrow(() -> new NotFoundException("Nenhum cliente encontrado com esse nome: " + nome));
    }

    public Cliente buscarClientePorUsuario(Long userId) {
        return clienteRepository.findByUsuarioUsuarioId(userId).
                orElseThrow(() -> new NotFoundException("Nenhum cliente encontrado com userId: " + userId));
    }


}