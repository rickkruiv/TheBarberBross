package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOEnderecoRequest;
import com.barberbross.BarberBross.dto.response.DTOEnderecoResponse;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.interfaces.TemEndereco;
import com.barberbross.BarberBross.model.Endereco;
import com.barberbross.BarberBross.repository.EnderecoRepository;
import com.barberbross.BarberBross.validation.implementations.EnderecoCamposUnicosValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnderecoService {

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private EnderecoCamposUnicosValidator validator;


    public void salvarEndereco(DTOEnderecoRequest dto, TemEndereco entidade) {
        validator.validar(dto);
        Endereco e = new Endereco(dto);
        enderecoRepository.save(e);
        entidade.atualizarEndereco(e);
    }

    public List<DTOEnderecoResponse> listarEnderecos() {
        return enderecoRepository.findAll()
                .stream()
                .map(DTOEnderecoResponse::new)
                .toList();
    }

    public DTOEnderecoResponse buscarEnderecoPorId(Long id) {
        Endereco e = buscarEndereco(id);
        return new DTOEnderecoResponse(e);
    }

    public void editarEndereco(DTOEnderecoRequest dto, TemEndereco entidade, Long idEndereco) {
        validator.validar(dto, idEndereco);
        Endereco e = buscarEndereco(idEndereco);
        e.atualizarDados(dto);
        entidade.atualizarEndereco(e);
    }

    protected Endereco buscarEndereco(Long id) {
        return enderecoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Nenhum Endereço encontrado com id: " + id));
    }
}