package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOCategoriaRequest;
import com.barberbross.BarberBross.dto.response.DTOCategoriaResponse;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Categoria;
import com.barberbross.BarberBross.model.Empresa;
import com.barberbross.BarberBross.model.Fornecedor;
import com.barberbross.BarberBross.notification.service.CategoriaNotifcationService;
import com.barberbross.BarberBross.repository.CategoriaRepository;
import com.barberbross.BarberBross.validation.implementations.AuthorizationValidator;
import com.barberbross.BarberBross.validation.implementations.CategoriaCamposUnicosValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private AuthenticatedUserService authUser;

    @Autowired
    private AuthorizationValidator authValidation;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private CategoriaCamposUnicosValidator validator;

    @Autowired
    private FornecedorService fornecedorService;

    @Autowired
    private EmpresaService empresaService;

    @Autowired
    private CategoriaNotifcationService notifcationService;

    public DTOCategoriaResponse salvarCategoria(DTOCategoriaRequest novaCategoria) {
        Categoria c;

        if (authUser.isAdmin()) {
            c = salvarCategoriaEmpresa(novaCategoria);
        } else {
            c = salvarCategoriaFornecedor(novaCategoria);
        }

        DTOCategoriaResponse response = new DTOCategoriaResponse(c);
        notifcationService.notificarNovaCategoria(response);
        return response;
    }

    private Categoria salvarCategoriaEmpresa(DTOCategoriaRequest novaCategoria){
        Empresa empresa = empresaService.buscarEmpresa(authUser.get().getEmpresaId());
        validator.validar(novaCategoria, empresa.getEmpresaId());
        Categoria c = new Categoria(novaCategoria,  empresa);
        validator.validarDono(c);
        return categoriaRepository.save(c);
    }

    private Categoria salvarCategoriaFornecedor(DTOCategoriaRequest novaCategoria){
        Fornecedor fornecedor = fornecedorService.buscarFornecedorPorUsuario(authUser.get().getUserId());
        validator.validarFornecedor(novaCategoria, fornecedor.getFornecedorId());
        Categoria c = new Categoria(novaCategoria, fornecedor);
        validator.validarDono(c);
        return categoriaRepository.save(c);
    }

    public List<DTOCategoriaResponse> listarCategorias() {
        if (authUser.isAdmin()){
            List<DTOCategoriaResponse> lista = listarCategoriasEmpresa(authUser.get().getEmpresaId());
            notifcationService.notificarListaCategorias(lista);
           return lista;
        } else {
            Fornecedor fornecedor = fornecedorService.buscarFornecedorPorUsuario(authUser.get().getUserId());
            return listarCategoriasFornecedor(fornecedor.getFornecedorId());
        }
    }


    private List<DTOCategoriaResponse> listarCategoriasEmpresa(Long empresaId){
        return categoriaRepository.findAllByEmpresaEmpresaId(empresaId)
                .stream()
                .map(DTOCategoriaResponse::new)
                .toList();
    }

    private List<DTOCategoriaResponse> listarCategoriasFornecedor(Long fornecedorId){
        return categoriaRepository.findAllByFornecedorFornecedorId(fornecedorId)
                .stream()
                .map(DTOCategoriaResponse::new)
                .toList();
    }

    public DTOCategoriaResponse buscarCategoriaPorId(Long id) {
        Categoria c = buscarCategoria(id);

        if (authUser.isAdmin()){
            authValidation.validarAcessoEmpresa(authUser.get(), c.getEmpresa().getEmpresaId());
        }
        //add validação de Fornecedor

        return new DTOCategoriaResponse(c);
    }

    public DTOCategoriaResponse editarCategoria(Long id, DTOCategoriaRequest categoriaEditada) {
        Categoria c = buscarCategoria(id);

        if (authUser.isAdmin()){
            authValidation.validarAcessoEmpresa(authUser.get(), c.getEmpresa().getEmpresaId());
        }
        //add valiadação de Fornecedor

        validator.validarCategoriaEditada(categoriaEditada, id);
        c.atualizarDado(categoriaEditada);
        categoriaRepository.save(c);

        DTOCategoriaResponse response = new DTOCategoriaResponse(c);
        notifcationService.notificarCategoriaEditada(response);

        return response;
    }

    public void deletarCategoria(Long id) {
        Categoria c = buscarCategoria(id);
        if (authUser.isAdmin()){
            authValidation.validarAcessoEmpresa(authUser.get(), c.getEmpresa().getEmpresaId());
        }
        //add valiadação de Fornecedor
        categoriaRepository.delete(c);
    }

    protected Categoria buscarCategoria(Long id){
        return categoriaRepository.findById(id).
                orElseThrow(() -> new NotFoundException("Nenhum Categoria encontrada com id: " + id));
    }
}