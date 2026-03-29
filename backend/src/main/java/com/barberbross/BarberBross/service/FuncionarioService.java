package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOFuncionarioRequest;
import com.barberbross.BarberBross.dto.response.DTOFuncionarioResponse;
import com.barberbross.BarberBross.dto.response.DTOFuncionarioSimplesResponse;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Agendamento;
import com.barberbross.BarberBross.model.Empresa;
import com.barberbross.BarberBross.model.Funcionario;
import com.barberbross.BarberBross.model.Usuario;
import com.barberbross.BarberBross.repository.EmpresaRepository;
import com.barberbross.BarberBross.repository.FuncionarioRepository;
import com.barberbross.BarberBross.repository.UsuarioRepository;
import com.barberbross.BarberBross.validation.implementations.FuncionarioCamposUnicosValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private FuncionarioCamposUnicosValidator validator;

    public DTOFuncionarioSimplesResponse salvarFuncionario(DTOFuncionarioRequest dto){
        validator.validar(dto);

        String senhaEncriptografada = new BCryptPasswordEncoder().encode(dto.senha());
        Usuario u = new Usuario(dto, senhaEncriptografada);
        Empresa e = empresaRepository.findById(dto.empresaId())
                .orElseThrow(() -> new NotFoundException("Nenhuma empresa encontrada"));

        usuarioRepository.save(u);

        Funcionario f = new Funcionario(dto, e, u);
        funcionarioRepository.save(f);

        return new DTOFuncionarioSimplesResponse(f);
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

        funcionarioAtual.atualizarDados(dto, agendamentos);
        funcionarioRepository.save(funcionarioAtual);

        return new DTOFuncionarioSimplesResponse(funcionarioAtual);
    }

    public void deletarFuncionario(Long id){
        Funcionario f = buscarFuncionario(id);
        funcionarioRepository.delete(f);
    }

    public Funcionario buscarFuncionario(Long id){
        return funcionarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Nenhum Funcionário encontrado com id: " + id));
    }

    protected Funcionario buscarFuncionarioPorEmpresa(Long funcionarioId, Long empresaId){
       return funcionarioRepository.findFuncionarioPorEmpresa(funcionarioId, empresaId)
               .orElseThrow(() -> new NotFoundException("Nenhum Funcionário com id: " + funcionarioId +
                       " foi encontrado na Empresa: " + empresaId)); //melhorar essa msg
    }

    protected Funcionario buscarFuncionarioPorUserId(Long userId){
        return funcionarioRepository.findByUsuarioUsuarioId(userId);
    }

}