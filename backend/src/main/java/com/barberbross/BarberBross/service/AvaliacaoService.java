package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOAvaliacaoRequest;
import com.barberbross.BarberBross.dto.response.DTOAvaliacaoResponse;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.*;
import com.barberbross.BarberBross.repository.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private EmpresaService empresaService;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private AgendamentoService agendamentoService;

    public DTOAvaliacaoResponse salvarAvaliacao(DTOAvaliacaoRequest novaAvaliacao){
        Empresa empresa = empresaService.buscarEmpresa(novaAvaliacao.empresaId());
        Cliente cliente = clienteService.buscarCliente(novaAvaliacao.clienteId());
        Agendamento agendamento = agendamentoService.buscarAgendamento(novaAvaliacao.agendamentoId());
        Avaliacao a = new Avaliacao(novaAvaliacao, cliente, empresa, agendamento);

        avaliacaoRepository.save(a);
        return new DTOAvaliacaoResponse(a);
    }

    public List<DTOAvaliacaoResponse> listarAvalicaoPorEmpresa(Long empresaId){
        return avaliacaoRepository.listarAvaliacoesPorEmpresa(empresaId).stream().map(DTOAvaliacaoResponse::new).toList();
    }

    public DTOAvaliacaoResponse buscarAvaliacaoPorId(Long id){
        Avaliacao a = buscarAvaliacao(id);
        return new DTOAvaliacaoResponse(a);
    }

    public DTOAvaliacaoResponse editarAvaliacao(Long id, DTOAvaliacaoRequest avaliacaoEditada){
        Avaliacao a = buscarAvaliacao(id);
        a.atualizarDados(avaliacaoEditada);
        avaliacaoRepository.save(a);
        return new DTOAvaliacaoResponse(a);
    }

    public void deletarAvaliacao(Long id){
        Avaliacao a = buscarAvaliacao(id);
        avaliacaoRepository.delete(a);
    }

    protected Avaliacao buscarAvaliacao(Long id){
        return avaliacaoRepository.findById(id).
                orElseThrow(() -> new NotFoundException("Nenhuma avaliação encontrada com id: " + id));
    }
}