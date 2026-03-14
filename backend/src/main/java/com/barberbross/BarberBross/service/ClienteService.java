package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOClienteRequest;
import com.barberbross.BarberBross.dto.response.DTOClienteResponse;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Cliente;
import com.barberbross.BarberBross.model.Usuario;
import com.barberbross.BarberBross.repository.ClienteRepository;
import com.barberbross.BarberBross.repository.UsuarioRepository;
import com.barberbross.BarberBross.validation.implementations.ClienteCamposUnicosValidator;
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

    public DTOClienteResponse salvarCliente(DTOClienteRequest dto) {
        validator.validar(dto);

        String senhaEncriptada = new BCryptPasswordEncoder().encode(dto.senha());
        Usuario u = new Usuario(dto, senhaEncriptada);
        usuarioRepository.save(u);

        Cliente c = new Cliente(dto, u);
        clienteRepository.save(c);

        return new DTOClienteResponse(c);
    }

    public List<DTOClienteResponse> listarClientes() {
        return clienteRepository.findAll()
                .stream()
                .map(DTOClienteResponse::new)
                .toList();
    }

    public DTOClienteResponse buscarClientePorId(Long id) {
        Cliente c = buscarCliente(id);
        return new DTOClienteResponse(c);
    }

    public DTOClienteResponse editarCliente(Long id, DTOClienteRequest clienteEditado) {
        validator.validar(clienteEditado, id);
        Cliente c = buscarCliente(id);
        c.atualizarDados(clienteEditado);
        clienteRepository.save(c);
        return new DTOClienteResponse(c);
    }

    public void deletarCliente(Long id) {
        Cliente c = buscarCliente(id);
        clienteRepository.delete(c);
    }

    protected Cliente buscarCliente(Long id) {
        return clienteRepository.findById(id).
                orElseThrow(() -> new NotFoundException("Nenhum cliente encontrado com esse id: " + id));
    }
}