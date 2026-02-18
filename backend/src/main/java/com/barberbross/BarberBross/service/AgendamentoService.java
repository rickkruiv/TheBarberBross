package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOAgendamentoRequest;
import com.barberbross.BarberBross.dto.response.DTOAgendamentoResponse;
import com.barberbross.BarberBross.enums.Status;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.*;
import com.barberbross.BarberBross.repository.AgendamentoRepository;
import com.barberbross.BarberBross.validation.implementations.AgendamentoConflitoHorariosValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private FuncionarioService funcionarioService;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private EmpresaService empresaService;

    @Autowired
    private ServicoService servicoService;

    @Autowired
    private AgendamentoConflitoHorariosValidator agendamentoValidation;

    public DTOAgendamentoResponse salvarAgendamento(DTOAgendamentoRequest dto) {
        agendamentoValidation.validar(dto);

        Cliente cliente = clienteService.buscarCliente(dto.clienteId());
        Empresa empresa = empresaService.buscarEmpresa(dto.empresaId());
        Funcionario funcionario = funcionarioService.buscarFuncionario(dto.funcionarioId());

        Agendamento novo = new Agendamento(dto, cliente, empresa, funcionario);

        List<Servico> servicos = servicoService.buscarListaDeServicos(dto);
        for (Servico s : servicos){ novo.adicionarServico(s); }

        agendamentoRepository.save(novo);
        return new DTOAgendamentoResponse(novo);
    }

    public List<DTOAgendamentoResponse> listarAgendamentos(Long empresaId) {
        return agendamentoRepository.findByEmpresaId(empresaId)
                .stream()
                .map(DTOAgendamentoResponse::new)
                .toList();
    }

    public DTOAgendamentoResponse buscarAgendamentoPorId(Long agendamentoId) {
        Agendamento a = buscarAgendamento(agendamentoId);
        return new DTOAgendamentoResponse(a);
    }

    public DTOAgendamentoResponse editarAgendamento(Long agendamentoId, DTOAgendamentoRequest dto) {
        Agendamento agendamentoAtual = buscarAgendamento(agendamentoId);

        if (dto.dataHorario().isAfter(agendamentoAtual.getDataHorario()) ||
                dto.dataHorario().isBefore(agendamentoAtual.getDataHorario())){
            agendamentoValidation.validar(dto);
        }

        agendamentoAtual.limparServicos();

        List<Servico> servicos = servicoService.buscarListaDeServicos(dto);
        for (Servico s : servicos){ agendamentoAtual.adicionarServico(s); }
        Funcionario funcionario = funcionarioService.buscarFuncionario(dto.funcionarioId());

        agendamentoAtual.atualizarDados(dto, funcionario);
        agendamentoRepository.save(agendamentoAtual);

        return new DTOAgendamentoResponse(agendamentoAtual);
    }

    public DTOAgendamentoResponse atualizarStatus(Long agendamentoId, Status status) {
        Agendamento existente = buscarAgendamento(agendamentoId);
        existente.setStatus(status);
        agendamentoRepository.save(existente);
        return new DTOAgendamentoResponse(existente);
    }

    public void deletarAgendamento(Long agendamentoId) {
        Agendamento agendamentoEncontrado = buscarAgendamento(agendamentoId);
        agendamentoRepository.delete(agendamentoEncontrado);
    }

    protected Agendamento buscarAgendamento(Long id){
        return agendamentoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Nenhum agendamento encontrado com id: " + id));
    }
}