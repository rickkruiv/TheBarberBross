package com.barberbross.BarberBross.service;

import com.barberbross.BarberBross.dto.request.DTOPagamentoRequest;
import com.barberbross.BarberBross.dto.response.DTOPagamentoResponse;
import com.barberbross.BarberBross.enums.Status;
import com.barberbross.BarberBross.exceptions.NotFoundException;
import com.barberbross.BarberBross.model.Agendamento;
import com.barberbross.BarberBross.model.Pagamento;
import com.barberbross.BarberBross.repository.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PagamentoService {

    @Autowired
    private AgendamentoService agendamentoService;

    @Autowired
    private PagamentoRepository pagamentoRepository;

    public DTOPagamentoResponse salvarPagamento(DTOPagamentoRequest dto) {
        Agendamento a = agendamentoService.buscarAgendamento(dto.agendamentoId());
        Pagamento p = new Pagamento(dto, a);
        pagamentoRepository.save(p);
        return new DTOPagamentoResponse(p);
    }

    public List<DTOPagamentoResponse> listarPagamentos() {
        return pagamentoRepository.findAll()
                .stream()
                .map(DTOPagamentoResponse::new)
                .toList();
    }

    public DTOPagamentoResponse buscarPagamentoPorId(Long id) {
        Pagamento p = buscarPagamento(id);
        return new DTOPagamentoResponse(p);
    }

    public DTOPagamentoResponse efetuarPagamento(Long id){
        Pagamento p = buscarPagamento(id);
        p.efetuarPagamento();
        return new DTOPagamentoResponse(p);
    }

    public void cancelarPagamento(Long id) {
        Pagamento p = buscarPagamento(id);
        if (p.getStatus() == Status.PENDENTE){
            p.cancelarPagamento();
        }
    }

    protected Pagamento buscarPagamento(Long id) {
        return pagamentoRepository.findById(id).
                orElseThrow(() -> new NotFoundException("Nenhum pagamento encontrado com id: " + id));
    }
}