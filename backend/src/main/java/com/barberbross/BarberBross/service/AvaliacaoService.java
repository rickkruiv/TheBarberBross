package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOAvaliacaoRequest;
import com.barberbross.BarberBross.dto.response.DTOAvaliacaoResponse;
import com.barberbross.BarberBross.enums.Status;
import com.barberbross.BarberBross.exceptions.AccessDeniedException;
import com.barberbross.BarberBross.exceptions.BadRequestException;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.*;
import com.barberbross.BarberBross.notification.service.AvaliacaoNotificationService;
import com.barberbross.BarberBross.repository.AvaliacaoRepository;
import com.barberbross.BarberBross.validation.implementations.AuthorizationValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvaliacaoService {

    @Autowired
    private AuthenticatedUserService authUser;

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private EmpresaService empresaService;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private AgendamentoService agendamentoService;

    @Autowired
    private FuncionarioService funcionarioService;

    @Autowired
    private AuthorizationValidator authValidator;

    @Autowired
    private AvaliacaoNotificationService notificationService;

    public DTOAvaliacaoResponse salvarAvaliacao(DTOAvaliacaoRequest novaAvaliacao){
        if (authUser.isColaborador() || authUser.isFornecedor()) //provisorio
            throw new AccessDeniedException("usuario não pode salvar avaliações em agendamentos"); //sera q faz sentido manter assim??

        Agendamento agendamento = agendamentoService.buscarAgendamento(novaAvaliacao.agendamentoId());

        authValidator.validarClienteNoAgendamento(authUser.get(), agendamento.getCliente().getClienteId());

        if (agendamento.getStatus().equals(Status.CONCLUIDO)){
            Empresa empresa = empresaService.buscarEmpresa(agendamento.getEmpresa().getEmpresaId());
            Cliente cliente = clienteService.buscarClientePorUsuario(authUser.get().getUserId());
            Funcionario funcionario = funcionarioService.buscarFuncionario(agendamento.getFuncionario().getFuncionarioId());

            Avaliacao a = new Avaliacao(novaAvaliacao, cliente, empresa, agendamento, funcionario);
            avaliacaoRepository.save(a);

            DTOAvaliacaoResponse response = new DTOAvaliacaoResponse(a);
            notificationService.notificarAvaliacaoAgendamento(response);

            return response;
        } else {
            throw new BadRequestException("Não é possível avaliar um agendamento que não foi concluído.");
        }
    }

    public List<DTOAvaliacaoResponse> listarAvalicaoPorEmpresa(Long empresaId){
        return avaliacaoRepository.listarAvaliacoesPorEmpresa(empresaId).stream().map(DTOAvaliacaoResponse::new).toList();
    }

    public List<DTOAvaliacaoResponse> listarAvalicaoPorBarbeiro(Long funcionarioId) {
        return avaliacaoRepository.listarAvaliacoesPorBarbeiro(funcionarioId).stream().map(DTOAvaliacaoResponse::new).toList();
    }

    public DTOAvaliacaoResponse buscarAvaliacaoPorId(Long id){
        Avaliacao a = buscarAvaliacao(id);
        return new DTOAvaliacaoResponse(a);
    }

    public DTOAvaliacaoResponse editarAvaliacao(Long id, DTOAvaliacaoRequest dto){
        if (authUser.isColaborador() || authUser.isFornecedor())
            throw new AccessDeniedException("Acesso negado: usuário não pode fazer alterações na avaliação.");

        Avaliacao avaliacao = buscarAvaliacao(id);
        Agendamento agendamento = agendamentoService.buscarAgendamento(dto.agendamentoId());
        authValidator.validarClienteNoAgendamento(authUser.get(), agendamento.getCliente().getClienteId());

        avaliacao.atualizarDados(dto);
        avaliacaoRepository.save(avaliacao);

        DTOAvaliacaoResponse response = new DTOAvaliacaoResponse(avaliacao);
        notificationService.notificarEdicaoAvaliacaoAgendamento(response);

        return response;
    }

    public void deletarAvaliacao(Long id){
        if (authUser.isColaborador() || authUser.isFornecedor())
            throw new AccessDeniedException("Acesso negado: usuário não pode deletar essa avaliação.");

        Avaliacao a = buscarAvaliacao(id);
        authValidator.validarClienteNaAvaliacao(authUser.get(), a.getAvaliacaoId());
        avaliacaoRepository.delete(a);
    }

    public Avaliacao buscarAvaliacao(Long id){
        return avaliacaoRepository.findById(id).
                orElseThrow(() -> new NotFoundException("Nenhuma avaliação encontrada com id: " + id));
    }
}