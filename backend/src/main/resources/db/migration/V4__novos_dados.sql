INSERT INTO usuarios (username, senha, nivel_acesso)
VALUES ('admin', '$2a$12$kPE0sErs4ceW.iJKtxDruOF.tDb46fBo0Z2Ny0Mkzho0phht9GvLC', 'ADMIN'),
       ('carlos', '$2a$12$WXRMNB5OH3DeBFjZC.ZJeuArI2m7Y3G.Pt7tw7rIAjJdFOZYKJ8JS', 'COLABORADOR'),
       ('joao', '$2a$12$sENZ.3StG08IvvVGfQ25qO42UYIvjE3uv.xf3sorPZffRVb2Lxeg6', 'CLIENTE'),
       ('pedro', '$2a$12$lfbqIwuNVGnV64.ptk5dIeSRDs4uqS4CQYktxuWA8lido/Cbh0SbC', 'COLABORADOR'),
       ('fornecedor', '$2a$12$o9/gdYEdFAMjRrl9lhGql.ong.jGq8vHkFB0AtN0AAu39/dUzBuxG', 'FORNECEDOR');

INSERT
INTO enderecos (cep, logradouro, complemento, numero, cidade, bairro, uf)
VALUES ('87010-000', 'Av. Brasil', 'Sala 1', '123', 'Maringá', 'Centro', 'PR'),
       ('87020-000', 'Rua Paraná', 'Loja 2', '456', 'Maringá', 'Zona 7', 'PR'),
       ('87030-000', 'Av. Colombo', 'Casa', '789', 'Maringá', 'Zona 1', 'PR'),
       ('87031-000', 'Av. São Paulo', '', '053', 'Maringá', 'Zona 2', 'PR');

INSERT INTO empresas (razao_social, nome_fantasia, cnpj, telefone, email, tipo_assinatura, endereco_id)
VALUES ('Barber Boss LTDA', 'Barber Boss', '12345678000101', '44999999999', 'contato@barberboss.com', 'PREMIUM', 1),
       ('Corte Fino LTDA', 'Corte Fino', '22345678000102', '44988888888', 'contato@cortefino.com', 'BASICO', 2),
       ('Navalha King LTDA', 'Navalha King', '32345678000103', '44977777777', 'contato@navalhaking.com', 'PRO',
        3);

INSERT INTO clientes (nome, email, telefone, usuario_id)
VALUES ('João Silva', 'joao@email.com', '44911111111', 3);

INSERT INTO funcionarios (nome, cpf, telefone, email, nascimento, data_contratacao, salario_base,
                          percentual_comissao, ativo, empresa_id, usuario_id)
VALUES ('Lucas Barbeiro', '11111111111', '44944444444', 'lucas@email.com', '1990-01-01', '2024-01-01', 2000, 10,
        true,
        1, 1),
       ('Carlos Fade', '22222222222', '44955555555', 'carlos@email.com', '1992-02-02', '2024-02-01', 2200, 15, true,
        1, 2),
       ('Pedro Corte', '33333333333', '44966666666', 'pedro@email.com', '1995-03-03', '2024-03-01', 1800, 12, true,
        2, 4);

INSERT INTO categorias (nome, descricao, tipo)
VALUES ('Corte', 'Serviços de corte de cabelo', 'SERVICO'),
       ('Barba', 'Serviços de barba', 'SERVICO'),
       ('Produto Capilar', 'Produtos para cabelo', 'PRODUTO');

INSERT INTO servicos (nome, descricao, preco, duracao, categoria_id)
VALUES ('Corte Masculino', 'Corte tradicional', 50.00, 30, 1),
       ('Barba Completa', 'Barba com toalha quente', 40.00, 25, 2),
       ('Corte + Barba', 'Combo completo', 80.00, 60, 1);

INSERT INTO produtos (nome, descricao, categoria_id)
VALUES ('Pomada Modeladora', 'Fixação forte', 3),
       ('Shampoo Anticaspa', 'Limpeza profunda', 3),
       ('Óleo para Barba', 'Hidratação da barba', 3);

INSERT INTO estoques (empresa_id)
VALUES (1),
       (2),
       (3);

INSERT INTO itens_estoque (estoque_id, produto_id, quantidade, preco_venda)
VALUES (1, 1, 20, 30.00),
       (1, 2, 15, 25.00),
       (2, 3, 10, 35.00);

INSERT INTO fornecedores (cnpj, email, endereco_id, razao_social, nome_fantasia, telefone, usuario_id)
VALUES ('99999999000101', 'fornecedor1@email.com', 4, 'Fornecedor A LTDA', 'Fornecedor A', '44900000001', 5);

INSERT INTO itens_fornecedor (produto_id, fornecedor_id, preco_fornecedor)
VALUES (1, 1, 20.00),
       (2, 1, 15.00),
       (3, 1, 25.00);

INSERT INTO agendamentos (data_horario, status, observacao, valor_total, cliente_id, empresa_id,
                          funcionario_id)
VALUES ('2026-03-31 10:00:00', 'PENDENTE', '', 50.00, 1, 1, 1),
       ('2026-03-31 11:00:00', 'PENDENTE', 'Preferência por fade', 80.00, 1, 1, 2),
       ('2026-03-31 14:00:00', 'PENDENTE', '', 40.00, 1, 2, 3);

INSERT INTO agendamentos_servicos (agendamento_id, servico_id, preco, duracao)
VALUES (1, 1, 50.00, 30),
       (2, 3, 80.00, 60),
       (3, 2, 40.00, 25);

INSERT INTO pagamentos (data_pagamento, valor, status, forma_pagamento, agendamento_id, pedido_id)
VALUES ('2026-03-31 10:30:00', 50.00, 'PENDENTE', 'DINHEIRO', 1, NULL),
       ('2026-03-31 11:30:00', 80.00, 'PENDENTE', 'PIX', 2, NULL),
       ('2026-03-31 15:00:00', 40.00, 'PENDENTE', 'CARTAO', 3, NULL);

INSERT INTO pedidos (data, status, empresa_id, fornecedor_id)
VALUES ('2026-03-25', 'PENDENTE', 1, 1),
       ('2026-03-26', 'PENDENTE', 2, 1),
       ('2026-03-27', 'PENDENTE', 3, 1);

INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, valor_unitario, valor_total)
VALUES (1, 1, 10, 20.00, 200.00),
       (2, 2, 5, 15.00, 75.00),
       (3, 3, 8, 25.00, 200.00);

INSERT INTO redes_sociais (url, empresa_id, plataforma, funcionario_id)
VALUES ('instagram.com/barberboss', 1, 'INSTAGRAM', NULL),
       ('facebook.com/cortefino', 2, 'FACEBOOK', NULL),
       ('instagram.com/navalhaking', 3, 'INSTAGRAM', NULL);

INSERT INTO avaliacoes (cliente_id, empresa_id, comentario, data, agendamento_id, funcionario_id, nota)
VALUES (1, 1, 'Ótimo atendimento!', '2026-03-31 12:00:00', 1, 1, 5.0),
       (1, 1, 'Corte perfeito', '2026-03-31 12:30:00', 2, 2, 4.5),
       (1, 2, 'Bom serviço', '2026-03-31 15:30:00', 3, 3, 4.0);