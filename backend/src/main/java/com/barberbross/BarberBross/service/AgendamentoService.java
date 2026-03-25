package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOAgendamentoRequest;
import com.barberbross.BarberBross.dto.request.DTOAtualizaServicosResquest;
import com.barberbross.BarberBross.dto.response.DTOAgendamentoResponse;
import com.barberbross.BarberBross.enums.Status;
import com.barberbross.BarberBross.exceptions.AccessDeniedException;
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
    private AuthenticatedUserService authUser;

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

    @Autowired
    NotificationService notificationService;

    public DTOAgendamentoResponse salvar(DTOAgendamentoRequest dto)  {
        agendamentoValidation.validar(dto);

        CustomUserPrincipal user = authUser.get();

        Agendamento agendamento = authUser.isColaborador()
                ? criarAgendamentoColaborador(dto, user)
                : criarAgendamentoCliente(dto);

        DTOAgendamentoResponse response = new DTOAgendamentoResponse(agendamento);
        WebSocketPayload<DTOAgendamentoResponse> payload = new WebSocketPayload<>("AGENDAMENTO CRIADO", response);
        notificationService.notificarEmpresa(response.empresaId(), "agendamentos", payload);
        notificationService.notificarFuncionario(response.funcionarioId(), "agenda", payload);

        return response;
    }

    private Agendamento criarAgendamentoColaborador(DTOAgendamentoRequest dto, CustomUserPrincipal user){
        if(!user.getEmpresaId().equals(dto.empresaId())){
            throw new AccessDeniedException("Acesso negado!");
        }

        Cliente cliente = clienteService.buscarCliente(dto.clienteId()); //pensar depois como vai ser se for cliente walk-in
        Empresa empresa = empresaService.buscarEmpresa(user.getEmpresaId());
        Funcionario funcionario = funcionarioService.buscarFuncionarioPorEmpresa(dto.funcionarioId(),
                user.getEmpresaId());

        return salvarAgendamento(dto, cliente, empresa, funcionario);
    }

    private Agendamento criarAgendamentoCliente(DTOAgendamentoRequest dto){
        if (empresaCerta(dto.empresaId(), dto.funcionarioId())){
            Cliente cliente = clienteService.buscarCliente(dto.clienteId());
            Empresa empresa = empresaService.buscarEmpresa(dto.empresaId());
            Funcionario funcionario = funcionarioService.buscarFuncionario(dto.funcionarioId());
            return salvarAgendamento(dto, cliente, empresa, funcionario);
        } else {
            throw new BadRequestException("Não foi possível criar o agendamento: o colaborador não está vinculado à empresa informada.");
        }
    }

    private Agendamento salvarAgendamento(DTOAgendamentoRequest dto, Cliente cliente,
                                          Empresa empresa, Funcionario funcionario){

        Agendamento novo = new Agendamento(dto, cliente, empresa, funcionario);

        List<Servico> servicos = servicoService.buscarListaDeServicos(dto);
        for (Servico s : servicos){ novo.adicionarServico(s); }
        return agendamentoRepository.save(novo);
    }

    public DTOAgendamentoResponse buscarAgendamentoPorId(Long agendamentoId) {
        Agendamento a = buscarAgendamento(agendamentoId);

        if ((authUser.isAdmin() || authUser.isColaborador()) && !(authUser.get().getEmpresaId().equals(a.getEmpresa().getEmpresaId()))){
            throw new AccessDeniedException("Acesso negado!");
        }

        return new DTOAgendamentoResponse(a);
    }

    public List<DTOAgendamentoResponse> listarAgendamentosEmpresaPorDia(LocalDate data) {
        if (authUser.isAdmin()){
            CustomUserPrincipal user = authUser.get();

            return agendamentoRepository
                    .listarAgendamentosEmpresaPorData(user.getEmpresaId(), data.atStartOfDay(), data.atTime(LocalTime.MAX))
                    .stream()
                    .map(DTOAgendamentoResponse::new)
                    .toList();

        } else {
            throw new AccessDeniedException("Acesso negado: operação restrita a usuários com perfil ADMIN.");
        }
    }

    public List<DTOAgendamentoResponse> listarAgendamentosBarbeiroPorDia(Long funcionarioId, LocalDate data) {
        if ((authUser.isAdmin() || authUser.isColaborador()) && (!empresaCerta(authUser.get().getEmpresaId(), funcionarioId))){
           throw new AccessDeniedException("Acesso negado: colaborador não pertence à empresa do usuário autenticado.");
        }

        return agendamentoRepository.listarAgendamentosBarbeiroPorData(funcionarioId,
                        data.atStartOfDay(), data.atTime(LocalTime.MAX))
                        .stream()
                        .map(DTOAgendamentoResponse::new)
                        .toList();

    }

    private boolean empresaCerta(Long empresaId, Long funcionarioId) {
        Empresa e = empresaService.buscarEmpresa(empresaId);
        Funcionario f = funcionarioService.buscarFuncionario(funcionarioId);
        return e.getFuncionarios().contains(f);
    }

    public List<DTOAgendamentoResponse> listarAgendamentosEmpresaPorPeriodo(LocalDate inicio, LocalDate fim) {
        if (authUser.isAdmin()){
            return agendamentoRepository.listarAgendamentosEmpresaPorData(authUser.get().getEmpresaId(), inicio.atStartOfDay(), fim.atTime(LocalTime.MAX))
                    .stream()
                    .map(DTOAgendamentoResponse::new)
                    .toList();
        } else {
            throw new AccessDeniedException("Acesso negado: operação restrita a usuários com perfil ADMIN.");
        }
    }

    public List<DTOAgendamentoResponse> listarAgendamentosBarbeiroPorPeriodo(Long funcionarioId, LocalDate inicio, LocalDate fim) {
        if ((authUser.isAdmin() || authUser.isColaborador()) && (!empresaCerta(authUser.get().getEmpresaId(), funcionarioId))) {
            throw new AccessDeniedException("Acesso negado: colaborador não pertence à empresa do usuário autenticado.");
        }

        return agendamentoRepository.listarAgendamentosBarbeiroPorData(funcionarioId, inicio.atStartOfDay(), fim.atTime(LocalTime.MAX))
                .stream()
                .map(DTOAgendamentoResponse::new)
                .toList();

    }

    //só falta mandar notificação websocket
    public DTOAgendamentoResponse editarServicosAgendamento(Long agendamentoId, DTOAtualizaServicosResquest dto) {
        Agendamento agendamentoAtual = buscarAgendamento(agendamentoId);

        if ((authUser.isAdmin() || authUser.isColaborador()) && !(authUser.get().getEmpresaId().
                equals(agendamentoAtual.getEmpresa().getEmpresaId()))){
            throw new AccessDeniedException("Acesso negado: usuário não tem permissão para editar os serviços deste agendamento.");
        }

        if (!authUser.isColaborador()){
            Cliente c = clienteService.buscarClientePorUsuario(authUser.get().getUserId());
            if (!c.getClienteId().equals(agendamentoAtual.getCliente().getClienteId())){
                throw new AccessDeniedException("Acesso negado: cliente não tem permissão para editar os serviços deste agendamento");
            }
        }

        if (agendamentoAtual.getStatus() == Status.PENDENTE || agendamentoAtual.getStatus() == Status.EM_ANDAMENTO){
            agendamentoAtual.limparServicos();

            List<Servico> servicos = servicoService.buscarListaDeServicos(dto);
            for (Servico s : servicos){ agendamentoAtual.adicionarServico(s); }

            //mudar isso dps, deixar clean (é só pro idiota do pedro usar)
            agendamentoRepository.save(agendamentoAtual);
            DTOAgendamentoResponse response = new DTOAgendamentoResponse(agendamentoAtual);
            WebSocketPayload<DTOAgendamentoResponse> payload = new WebSocketPayload<>("AGENDAMENTO EDITADO", response);

            notificationService.notificarEmpresa(agendamentoAtual.getEmpresa().getEmpresaId(), "agendamentos",payload);
            notificationService.notificarFuncionario(agendamentoAtual.getCliente().getClienteId(), "agenda", payload);

            return response;
        } else {
            throw new BadRequestException("Não foi possível alterar os serviços. Agendamento está: " + agendamentoAtual.getStatus());
        }

    }

    public DTOAgendamentoResponse atualizarStatus(Long agendamentoId, Status status) {
        Agendamento existente = buscarAgendamento(agendamentoId);

        if (empresaCerta(authUser.get().getEmpresaId(), existente.getFuncionario().getFuncionarioId())){

            if (existente.getStatus() == Status.PENDENTE || existente.getStatus() == Status.EM_ANDAMENTO){
                existente.setStatus(status);
                agendamentoRepository.save(existente);

                //mudar dps e deixar clean plmds!!!!!1
                DTOAgendamentoResponse response = new DTOAgendamentoResponse(existente);
                WebSocketPayload<DTOAgendamentoResponse> payload = new WebSocketPayload<>("AGENDAMENTO EDITADO", response);

                notificationService.notificarEmpresa(existente.getEmpresa().getEmpresaId(), "agendamentos",payload);
                notificationService.notificarFuncionario(existente.getCliente().getClienteId(), "agenda", payload);

                return response;
            } else {
                throw new BadRequestException("Não foi possível alterar o status. Agendamento está: " + existente.getStatus());
            }

        } else {
            throw new AccessDeniedException("Acesso negado: usuário não tem permissão para alterar o status deste agendamento.");
        }

    }

    public void deletarAgendamento(Long agendamentoId) {
        Agendamento agendamentoEncontrado = buscarAgendamento(agendamentoId);

        if (authUser.isColaborador() && (!authUser.get().getEmpresaId().equals(agendamentoEncontrado.getEmpresa().getEmpresaId()))){
            throw new AccessDeniedException("Acesso negado: usuário não pode deletar este agendamento.");
        } else if (!authUser.isColaborador()){
            Cliente c = clienteService.buscarCliente(agendamentoEncontrado.getCliente().getClienteId());

            if (!authUser.get().getUserId().equals(c.getUsuario().getUsuarioId())){
                throw new BadRequestException("Cliente não possui permissão para deletar este agendamento");
            }
        }

        agendamentoRepository.delete(agendamentoEncontrado);
    }

    protected Agendamento buscarAgendamento(Long id){
        return agendamentoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Nenhum agendamento encontrado com id: " + id));
    }
}