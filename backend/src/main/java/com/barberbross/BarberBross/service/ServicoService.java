package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOAgendamentoRequest;
import com.barberbross.BarberBross.dto.request.DTOAtualizaServicosResquest;
import com.barberbross.BarberBross.dto.request.DTOServicoRequest;
import com.barberbross.BarberBross.dto.response.DTOServicoResponse;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Categoria;
import com.barberbross.BarberBross.model.Empresa;
import com.barberbross.BarberBross.model.Servico;
import com.barberbross.BarberBross.notification.service.ServicosNotificationService;
import com.barberbross.BarberBross.repository.ServicoRepository;
import com.barberbross.BarberBross.validation.implementations.AuthorizationValidator;
import com.barberbross.BarberBross.validation.implementations.ServicoCamposUnicosValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicoService {

    @Autowired
    private AuthenticatedUserService authUser;

    @Autowired
    private AuthorizationValidator authValidation;

    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private ServicoCamposUnicosValidator validator;

    @Autowired
    private EmpresaService empresaService;

    @Autowired
    private ServicosNotificationService notificationService;

    public DTOServicoResponse salvarServico(DTOServicoRequest dto) {
        if (authUser.isAdmin()){
            authValidation.validarAcessoEmpresa(authUser.get(), dto.empresaId());
            validator.validar(dto);
        }

        Categoria c = categoriaService.buscarCategoria(dto.categoriaId());
        Empresa e = empresaService.buscarEmpresa(dto.empresaId());
        Servico s = new Servico(dto, c, e);

        servicoRepository.save(s);
        DTOServicoResponse response = new DTOServicoResponse(s);
        notificationService.notificarNovoServico(response);

        return response;
    }

    public List<DTOServicoResponse> listarServicos(Long empresaId) {
        return servicoRepository.findAllByEmpresaEmpresaId(empresaId)
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
        if (authUser.isAdmin()){
            authValidation.validarAcessoEmpresa(authUser.get(), servicoAtual.getEmpresa().getEmpresaId());
            validator.validar(dto, id);
        }

        Categoria c = categoriaService.buscarCategoria(dto.categoriaId());
        authValidation.validarCategoriaEmpresa(authUser.get(), c.getCategoriaId());

        servicoAtual.atualizarDados(dto, c);
        servicoRepository.save(servicoAtual);

        DTOServicoResponse response = new DTOServicoResponse(servicoAtual);
        notificationService.notificarServicoEditado(response);

        return response;
    }

    public void deletarServico(Long id) {
        Servico s = buscarServico(id);
        if (authUser.isAdmin()){
            authValidation.validarAcessoEmpresa(authUser.get(), s.getEmpresa().getEmpresaId());
        }
        servicoRepository.delete(s);
    }

    protected Servico buscarServico(Long id){
        return servicoRepository.findById(id).
                orElseThrow(() -> new NotFoundException("Nenhum serviço encontrado com id: " + id));
    }

    protected List<Servico> buscarListaDeServicos(DTOAtualizaServicosResquest dto){
        return servicoRepository.findAllById(dto.servicos());
    }

    protected List<Servico> buscarListaDeServicos(DTOAgendamentoRequest dto){
        return servicoRepository.findAllById(dto.listaDeServicosId());
    }
}