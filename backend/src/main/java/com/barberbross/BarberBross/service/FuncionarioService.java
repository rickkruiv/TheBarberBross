package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOFuncionarioPerfilRequest;
import com.barberbross.BarberBross.dto.request.DTOFuncionarioRequest;
import com.barberbross.BarberBross.dto.request.DTOUsuarioRequest;
import com.barberbross.BarberBross.dto.response.DTOFuncionarioResponse;
import com.barberbross.BarberBross.dto.response.DTOFuncionarioSimplesResponse;
import com.barberbross.BarberBross.enums.NivelAcesso;
import com.barberbross.BarberBross.exceptions.AccessDeniedException;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Agendamento;
import com.barberbross.BarberBross.model.Empresa;
import com.barberbross.BarberBross.model.Funcionario;
import com.barberbross.BarberBross.model.Usuario;
import com.barberbross.BarberBross.repository.EmpresaRepository;
import com.barberbross.BarberBross.repository.FuncionarioRepository;
import com.barberbross.BarberBross.repository.UsuarioRepository;
import com.barberbross.BarberBross.validation.implementations.AuthorizationValidator;
import com.barberbross.BarberBross.validation.implementations.FuncionarioCamposUnicosValidator;
import jakarta.transaction.Transactional;
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

    @Autowired
    private AuthenticatedUserService authUser;

    @Autowired
    private AuthorizationValidator authValidation;

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

    public List<DTOFuncionarioSimplesResponse> listarFuncionario(Long empresaId){
        return funcionarioRepository.buscarFuncionariosPorEmpresa(empresaId)
                .stream()
                .map(DTOFuncionarioSimplesResponse::new)
                .toList();
    }

    public DTOFuncionarioResponse buscarFuncionarioPorId(Long id){
        Funcionario f = buscarFuncionario(id);
        return new DTOFuncionarioResponse(f);
    }

    public DTOFuncionarioSimplesResponse editarFuncionario(Long id, DTOFuncionarioRequest dto){
        if(authUser.isAdmin() && authValidation.funcionarioPertenceEmpresa(id, dto.empresaId())){
            Funcionario funcionarioAtual = buscarFuncionario(id);

            if (!funcionarioAtual.getCpf().equals(dto.cpf())){
                validator.validar(dto, id);
            }

            List<Agendamento> agendamentos = funcionarioAtual.getAgendamentos();

            funcionarioAtual.atualizarDados(dto, agendamentos);
            funcionarioRepository.save(funcionarioAtual);

            return new DTOFuncionarioSimplesResponse(funcionarioAtual);
        } else {
            throw new AccessDeniedException("Usuário não tem permissão para alterar os dados deste Funcionário.");
        }
    }

    public DTOFuncionarioSimplesResponse editarPerfilFuncionario(Long id, DTOFuncionarioPerfilRequest dto){
        if(authUser.isColaborador() && authUser.get().getFuncionarioId().equals(id)){
            Funcionario funcionarioAtual = buscarFuncionario(id);

            if (!funcionarioAtual.getCpf().equals(dto.cpf())){
                validator.validar(dto, id);
            }

            funcionarioAtual.atualizarDadosPerfil(dto);
            funcionarioRepository.save(funcionarioAtual);

            Usuario u = usuarioRepository.findById(funcionarioAtual.getUsuario().getUsuarioId())
                    .orElseThrow(() -> new NotFoundException("Nenhum usuário encontrado."));

            DTOUsuarioRequest request = new DTOUsuarioRequest(dto.email(), dto.senha(), NivelAcesso.COLABORADOR);
            String senhaHash = new BCryptPasswordEncoder().encode(request.senha());
            u.atualizarDados(request, senhaHash);
            usuarioRepository.save(u);

            return new DTOFuncionarioSimplesResponse(funcionarioAtual);
        } else {
            throw new AccessDeniedException("Acesso negado: usuário não tem permissão para alterar os dados deste funcionário.");
        }
    }

    public void deletarFuncionario(Long id){
        if (authUser.isAdmin() && authValidation.funcionarioPertenceEmpresa(id, authUser.get().getEmpresaId())){
            Funcionario f = buscarFuncionario(id);
            f.setAtivo(false);
            funcionarioRepository.save(f);
        } else {
            throw new AccessDeniedException("Acesso negado: usuário não tem permissão para excluir este funcionário.");
        }
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