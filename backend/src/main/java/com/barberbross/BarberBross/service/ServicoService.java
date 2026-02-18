package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOAgendamentoRequest;
import com.barberbross.BarberBross.dto.request.DTOServicoRequest;
import com.barberbross.BarberBross.dto.response.DTOServicoResponse;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Categoria;
import com.barberbross.BarberBross.model.Servico;
import com.barberbross.BarberBross.repository.ServicoRepository;
import com.barberbross.BarberBross.validation.implementations.ServicoCamposUnicosValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicoService {

    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private ServicoCamposUnicosValidator validator;

    public DTOServicoResponse salvarServico(DTOServicoRequest dto) {
        validator.validar(dto);
        Categoria c = categoriaService.buscarCategoria(dto.categoriaId());
        Servico s = new Servico(dto, c);
        servicoRepository.save(s);
        return new DTOServicoResponse(s);
    }

    public List<DTOServicoResponse> listarServicos() {
        return servicoRepository.findAll()
                .stream()
                .map(DTOServicoResponse::new)
                .toList();
    }

    public DTOServicoResponse buscarServicoPorId(Long id) {
        Servico s = buscarServico(id);
        return new  DTOServicoResponse(s);
    }

    public DTOServicoResponse editarServico(Long id, DTOServicoRequest dto) {
        Servico servicoAtual = buscarServico(id);

        if (!servicoAtual.getNome().equals(dto.nome())) {
            validator.validar(dto);
        }

        Categoria c = categoriaService.buscarCategoria(dto.categoriaId());
        servicoAtual.atualizarDados(dto, c);
        servicoRepository.save(servicoAtual);
        return new DTOServicoResponse(servicoAtual);
    }

    public void deletarServico(Long id) {
        Servico s = buscarServico(id);
        servicoRepository.delete(s);
    }

    protected Servico buscarServico(Long id){
        return servicoRepository.findById(id).
                orElseThrow(() -> new NotFoundException("Nenhum serviço encontrado com id: " + id));
    }

    protected List<Servico> buscarListaDeServicos(DTOAgendamentoRequest dto){
        return servicoRepository.findAllById(dto.listaDeServicosId());
    }
}