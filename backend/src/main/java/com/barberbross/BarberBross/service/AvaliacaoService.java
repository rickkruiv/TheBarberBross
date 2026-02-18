package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOAvaliacaoRequest;
import com.barberbross.BarberBross.dto.response.DTOAvaliacaoResponse;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Avaliacao;
import com.barberbross.BarberBross.model.Cliente;
import com.barberbross.BarberBross.model.Empresa;
import com.barberbross.BarberBross.model.Servico;
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
    private ServicoService servicoService;

    public DTOAvaliacaoResponse salvarAvaliacao(DTOAvaliacaoRequest novaAvaliacao){
        Empresa empresa = empresaService.buscarEmpresa(novaAvaliacao.empresaId());
        Cliente cliente = clienteService.buscarCliente(novaAvaliacao.clienteId());
        Servico servico = servicoService.buscarServico(novaAvaliacao.servicoId());
        Avaliacao a = new Avaliacao(novaAvaliacao, cliente, empresa, servico);

        avaliacaoRepository.save(a);
        return new DTOAvaliacaoResponse(a);
    }

    public List<DTOAvaliacaoResponse> listarAvalicao(){
        return avaliacaoRepository.findAll()
                .stream()
                .map(DTOAvaliacaoResponse::new)
                .toList();
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