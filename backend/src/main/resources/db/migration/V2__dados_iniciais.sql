-- =========================
-- ENDERECOS
-- =========================
INSERT INTO enderecos (cep, logradouro, complemento, numero, cidade, bairro, uf)
VALUES ('87020-000', 'Rua das Palmeiras', NULL, '100', 'Maringá', 'Centro', 'PR'),
       ('87030-000', 'Av. Brasil', 'Sala 01', '2500', 'Maringá', 'Zona 01', 'PR');

-- =========================
-- EMPRESA
-- =========================
INSERT INTO empresas (razao_social,
                      nome_fantasia,
                      cnpj,
                      telefone,
                      email,
                      tipo_assinatura,
                      endereco_id)
VALUES ('BarberBross LTDA',
        'BarberBross',
        '12.345.678/0001-99',
        '(44) 99999-9999',
        'contato@barberbross.com',
        'PREMIUM',
        1);

-- =========================
-- CLIENTE
-- =========================
INSERT INTO clientes (nome, email, senha, telefone)
VALUES ('João Silva', 'joao@gmail.com', '123456', '(44) 98888-1111');

-- =========================
-- CATEGORIAS
-- =========================
INSERT INTO categorias (nome, descricao, tipo)
VALUES ('Corte Masculino', 'Cortes tradicionais e modernos', 'SERVICO'),
       ('Barba', 'Serviços de barba e acabamento', 'SERVICO'),
       ('Produtos Capilares', 'Produtos para cabelo e barba', 'PRODUTO');

-- =========================
-- SERVICOS
-- =========================
INSERT INTO servicos (nome, descricao, preco, duracao, categoria_id)
VALUES ('Corte Tradicional', 'Corte masculino tradicional', 35.00, 30, 1),
       ('Corte Degradê', 'Degradê navalhado', 45.00, 40, 1),
       ('Barba Completa', 'Barba com toalha quente', 30.00, 25, 2);

-- =========================
-- PRODUTOS
-- =========================
INSERT INTO produtos (nome, descricao, categoria_id)
VALUES ('Pomada Modeladora', 'Pomada efeito seco', 3),
       ('Óleo para Barba', 'Óleo hidratante', 3);


-- =========================
-- FUNCIONARIO
-- =========================
INSERT INTO funcionarios (nome, cpf, rg, telefone, email, nascimento, estado_civil, endereco_id)
VALUES ('Carlos Barbeiro',
        '123.456.789-00',
        '12.345.678-9',
        '(44) 97777-7777',
        'carlos@barberbross.com',
        '1995-05-10',
        'SOLTEIRO',
        2);

-- =========================
-- USUARIO
-- =========================
INSERT INTO usuarios (username, senha, nivel_acesso, funcionario_id)
VALUES ('carlos',
        '123456',
        'ADMIN',
        1);

-- =========================
-- AGENDAMENTO
-- =========================
INSERT INTO agendamentos (data_horario,
                          status,
                          observacao,
                          valor_total,
                          cliente_id,
                          empresa_id,
                          funcionario_id)
VALUES (NOW() + INTERVAL '1 day',
        'PENDENTE',
        'Cliente prefere corte baixo',
        80.00,
        1,
        1,
        1);

-- =========================
-- SERVICO x AGENDAMENTO
-- =========================
INSERT INTO servico_agendamento (agendamento_id, servico_id)
VALUES (1, 1),
       (1, 3);

-- =========================
-- AVALIACAO
-- =========================
INSERT INTO avaliacoes (cliente_id,
                        empresa_id,
                        servico_id,
                        avaliacao,
                        comentario,
                        data)
VALUES (1,
        1,
        1,
        5,
        'Atendimento excelente!',
        NOW());

-- =========================
-- REDES SOCIAIS
-- =========================
INSERT INTO redes_sociais (url, empresa_id)
VALUES ('https://instagram.com/barberbross', 1),
       ('https://facebook.com/barberbross', 1);
