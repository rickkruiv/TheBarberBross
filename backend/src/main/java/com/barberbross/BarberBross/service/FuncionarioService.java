package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOEnderecoRequest;
import com.barberbross.BarberBross.dto.request.DTOFuncionarioRequest;
import com.barberbross.BarberBross.dto.response.DTOEnderecoResponse;
import com.barberbross.BarberBross.dto.response.DTOFuncionarioResponse;
import com.barberbross.BarberBross.dto.response.DTOFuncionarioSimplesResponse;
import com.barberbross.BarberBross.exceptions.ConflictException;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Agendamento;
import com.barberbross.BarberBross.model.CargoFuncionario;
import com.barberbross.BarberBross.model.Funcionario;
import com.barberbross.BarberBross.repository.FuncionarioRepository;
import com.barberbross.BarberBross.validation.implementations.FuncionarioCamposUnicosValidator;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    private EnderecoService enderecoService;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private FuncionarioCamposUnicosValidator validator;

    public DTOFuncionarioSimplesResponse salvarFuncionario(DTOFuncionarioRequest dto){
        validator.validar(dto);
        Funcionario f = new Funcionario(dto);
        funcionarioRepository.save(f);
        return new DTOFuncionarioSimplesResponse(f);
    }

    @Transactional
    public void salvarEnderecoFuncionario(Long id, DTOEnderecoRequest endereco){
        Funcionario funcionario = buscarFuncionario(id);
        if (funcionario.getEndereco() == null){
            enderecoService.salvarEndereco(endereco, funcionario);
        } else {
            throw new ConflictException("Funcionário já tem Endereço cadastrado.");
        }
    }

    public DTOEnderecoResponse buscarEnderecoFuncionario(Long id) {
        Funcionario f = buscarFuncionario(id);
        if (f.getEndereco() != null) {
            return enderecoService.buscarEnderecoPorId(f.getEndereco().getEnderecoId());
        } else {
            throw new NotFoundException("Funcionário não tem Endereço cadastrado.");
        }
    }

    @Transactional
    public void editarEnderecoFuncionario(Long id, DTOEnderecoRequest endereco) {
        Funcionario funcionario = buscarFuncionario(id);
        enderecoService.editarEndereco(endereco, funcionario, funcionario.getEndereco().getEnderecoId());
    }

    public List<DTOFuncionarioSimplesResponse> listarFuncionario(){
        return funcionarioRepository.findAll()
                .stream()
                .map(DTOFuncionarioSimplesResponse::new)
                .toList();
    }

    public DTOFuncionarioResponse buscarFuncionarioPorId(Long id){
        Funcionario f = buscarFuncionario(id);
        return new DTOFuncionarioResponse(f);
    }

    public DTOFuncionarioSimplesResponse editarFuncionario(Long id, DTOFuncionarioRequest dto){
        Funcionario funcionarioAtual = buscarFuncionario(id);

        if (!funcionarioAtual.getCpf().equals(dto.cpf())){
            validator.validar(dto, id);
        }

        List<Agendamento> agendamentos = funcionarioAtual.getAgendamentos();
        List<CargoFuncionario> historicoCargos = funcionarioAtual.getCargosFuncionario();

        funcionarioAtual.atualizarDados(dto, agendamentos, historicoCargos);
        funcionarioRepository.save(funcionarioAtual);

        return new DTOFuncionarioSimplesResponse(funcionarioAtual);
    }

    public void deletarFuncionario(Long id){
        Funcionario f = buscarFuncionario(id);
        funcionarioRepository.delete(f);
    }

    protected Funcionario buscarFuncionario(Long id){
        return funcionarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Nenhum Funcionário encontrado com id: " + id));
    }

}