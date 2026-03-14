package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOUsuarioRequest;
import com.barberbross.BarberBross.dto.response.DTOUsuarioResponse;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Usuario;
import com.barberbross.BarberBross.repository.UsuarioRepository;
import com.barberbross.BarberBross.validation.implementations.UsuarioCamposUnicosValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioCamposUnicosValidator validator;

//    @Transactional
//    public DTOUsuarioResponse salvarUsuario(DTOUsuarioRequest dto, String senhaEncriptada) {
//        validator.validar(dto);
//        Usuario u = new Usuario(dto, senhaEncriptada);
//        usuarioRepository.save(u);
//
// n vai mais existir se pa
//        return new DTOUsuarioResponse(u);
//    }

    public List<DTOUsuarioResponse> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(DTOUsuarioResponse::new)
                .toList();
    }

    public DTOUsuarioResponse buscarUsuarioPorId(Long id) {
        Usuario u = buscarUsuario(id);
        return new DTOUsuarioResponse(u);
    }

    public DTOUsuarioResponse editarUsuario(Long id, DTOUsuarioRequest dto) {
        Usuario usuarioAtual = buscarUsuario(id);

        if(!usuarioAtual.getUsername().equals(dto.username())){
            validator.validar(dto);
        }

        usuarioAtual.atualizarDados(dto);
        usuarioRepository.save(usuarioAtual);
        return new DTOUsuarioResponse(usuarioAtual);
    }

    public void deletarUsuario(Long id) {
        Usuario u = buscarUsuario(id);
        usuarioRepository.delete(u);
    }

    private Usuario buscarUsuario(Long id){
        return usuarioRepository.findById(id).
                orElseThrow(() -> new NotFoundException("Nenhum usuário encontrado com id: " + id));
    }
}