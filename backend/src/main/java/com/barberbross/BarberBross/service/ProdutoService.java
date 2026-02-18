package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOProdutoRequest;
import com.barberbross.BarberBross.dto.response.DTOProdutoResponse;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Categoria;
import com.barberbross.BarberBross.model.Produto;
import com.barberbross.BarberBross.repository.ProdutoRepository;
import com.barberbross.BarberBross.validation.implementations.ProdutoCamposUnicosValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ProdutoCamposUnicosValidator validator;

    public DTOProdutoResponse salvarProduto(DTOProdutoRequest dto) {
        validator.validar(dto);
        Categoria c = categoriaService.buscarCategoria(dto.categoriaId());
        Produto p = new Produto(dto, c);
        produtoRepository.save(p);
        return new DTOProdutoResponse(p);
    }

    public List<DTOProdutoResponse> listarProdutos() {
        return produtoRepository.findAll()
                .stream()
                .map(DTOProdutoResponse::new)
                .toList();
    }

    public DTOProdutoResponse buscarProdutoPorId(Long id) {
        Produto p = buscarProduto(id);
        return new DTOProdutoResponse(p);
    }

    public DTOProdutoResponse editarProduto(Long id, DTOProdutoRequest dto) {
        Produto produtoAtual = buscarProduto(id);

        if (!produtoAtual.getNome().equals(dto.nome())){
            validator.validar(dto);
        }

        Categoria c = categoriaService.buscarCategoria(dto.categoriaId());
        produtoAtual.atualizarDados(dto, c);
        produtoRepository.save(produtoAtual);
        return new DTOProdutoResponse(produtoAtual);
    }

    public void deletarProduto(Long id) {
        Produto p = buscarProduto(id);
        produtoRepository.delete(p);
    }

    protected Produto buscarProduto(Long id){
        return produtoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Nenhum Produto encontrado com id: " + id));
    }

}