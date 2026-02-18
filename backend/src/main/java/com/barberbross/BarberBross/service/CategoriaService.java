package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOCategoriaRequest;
import com.barberbross.BarberBross.dto.response.DTOCategoriaResponse;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Categoria;
import com.barberbross.BarberBross.repository.CategoriaRepository;
import com.barberbross.BarberBross.validation.implementations.CategoriaCamposUnicosValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private CategoriaCamposUnicosValidator validator;

    public DTOCategoriaResponse salvarCategoria(DTOCategoriaRequest novaCategoria) {
        validator.validar(novaCategoria);
        Categoria c = new Categoria(novaCategoria);
        categoriaRepository.save(c);
        return new DTOCategoriaResponse(c);
    }

    public List<DTOCategoriaResponse> listarCategorias() {
        return categoriaRepository.findAll()
                .stream()
                .map(DTOCategoriaResponse::new)
                .toList();
    }

    public DTOCategoriaResponse buscarCategoriaPorId(Long id) {
        Categoria c = buscarCategoria(id);
        return new DTOCategoriaResponse(c);
    }

    public DTOCategoriaResponse editarCategoria(Long id, DTOCategoriaRequest categoriaEditada) {
        validator.validar(categoriaEditada, id);
        Categoria c = buscarCategoria(id);
        c.atualizarDado(categoriaEditada);
        categoriaRepository.save(c);
        return new DTOCategoriaResponse(c);
    }

    public void deletarCategoria(Long id) {
        Categoria c = buscarCategoria(id);
        categoriaRepository.delete(c);
    }

    protected Categoria buscarCategoria(Long id){
        return categoriaRepository.findById(id).
                orElseThrow(() -> new NotFoundException("Nenhum Categoria encontrada com id: " + id));
    }
}