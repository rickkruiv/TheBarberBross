package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOAgendamentoRequest;
import com.barberbross.BarberBross.dto.request.DTOAtualizaServicosResquest;
import com.barberbross.BarberBross.dto.response.DTOAgendamentoResponse;
import com.barberbross.BarberBross.enums.Status;
import com.barberbross.BarberBross.exceptions.BadRequestException;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.*;
import com.barberbross.BarberBross.repository.AgendamentoRepository;
import com.barberbross.BarberBross.validation.implementations.AgendamentoConflitoHorariosValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
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

    public List<DTOAgendamentoResponse> listarAgendamentosPorDia(Long empresaId, LocalDate data) {
        return agendamentoRepository.listarAgendamentosPorData(empresaId, data.atStartOfDay(), data.atTime(LocalTime.MAX))
                .stream()
                .map(DTOAgendamentoResponse::new)
                .toList();
    }

    public List<DTOAgendamentoResponse> listarAgendamentosPorPeriodo(Long empresaId, LocalDate inicio, LocalDate fim) {
        return agendamentoRepository.listarAgendamentosPorData(empresaId, inicio.atStartOfDay(), fim.atTime(LocalTime.MAX))
                .stream()
                .map(DTOAgendamentoResponse::new)
                .toList();
    }

    public DTOAgendamentoResponse buscarAgendamentoPorId(Long agendamentoId) {
        Agendamento a = buscarAgendamento(agendamentoId);
        return new DTOAgendamentoResponse(a);
    }

    public DTOAgendamentoResponse editarServicosAgendamento(Long agendamentoId, DTOAtualizaServicosResquest dto) {
        Agendamento agendamentoAtual = buscarAgendamento(agendamentoId);

        if (agendamentoAtual.getStatus() == Status.PENDENTE || agendamentoAtual.getStatus() == Status.EM_ANDAMENTO){
            agendamentoAtual.limparServicos();

            List<Servico> servicos = servicoService.buscarListaDeServicos(dto);
            for (Servico s : servicos){ agendamentoAtual.adicionarServico(s); }

            agendamentoRepository.save(agendamentoAtual);

            return new DTOAgendamentoResponse(agendamentoAtual);
        }

        throw new BadRequestException("Não foi possível alterar os serviços. Agendamento está: " + agendamentoAtual.getStatus());
    }

    public DTOAgendamentoResponse atualizarStatus(Long agendamentoId, Status status) {
        Agendamento existente = buscarAgendamento(agendamentoId);

        if (existente.getStatus() == Status.PENDENTE || existente.getStatus() == Status.EM_ANDAMENTO){
            existente.setStatus(status);
            agendamentoRepository.save(existente);
            return new DTOAgendamentoResponse(existente);
        }

        throw new BadRequestException("Não foi possível alterar o status. Agendamento está: " + existente.getStatus());
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