-- =========================
-- LIMPANDO OS DADOS
-- =========================
TRUNCATE TABLE
    agendamentos,
    avaliacoes,
    cargos,
    cargos_funcionario,
    categorias,
    clientes,
    empresas,
    enderecos,
    fornecedores,
    funcionarios,
    produtos,
    redes_sociais,
    servico_agendamento,
    servicos,
    usuarios
RESTART IDENTITY CASCADE;

-- =========================
-- DROPS
-- =========================

DROP TABLE IF EXISTS servico_agendamento CASCADE;

DROP TABLE IF EXISTS cargos CASCADE;

DROP TABLE IF EXISTS cargos_funcionarios CASCADE;

-- =========================
-- DROPS
-- =========================


-- =========================
-- ALTERAÇÕES
-- =========================

ALTER TABLE avaliacoes
DROP
COLUMN avaliacao;

ALTER TABLE avaliacoes
DROP
CONSTRAINT fk_av_servico;

ALTER TABLE avaliacoes
DROP
COLUMN servico_id;

ALTER TABLE avaliacoes
    ADD COLUMN agendamento_id BIGINT NOT NULL,
    ADD COLUMN funcionario_id BIGINT NOT NULL,
    ADD COLUMN nota NUMERIC(3,2) NOT NULL;

ALTER TABLE avaliacoes
    ADD CONSTRAINT fk_av_agendamento FOREIGN KEY (agendamento_id)
        REFERENCES agendamentos (agendamento_id),

    ADD CONSTRAINT fk_av_funcionario FOREIGN KEY (funcionario_id)
        REFERENCES funcionarios (funcionario_id),

    ADD CONSTRAINT uk_av_agendamento UNIQUE (agendamento_id);

ALTER TABLE fornecedores
DROP
COLUMN nome;

ALTER TABLE fornecedores
    ADD COLUMN razao_social VARCHAR(255) NOT NULL,
    ADD COLUMN nome_fantasia VARCHAR(255) NOT NULL,
    ADD COLUMN telefone VARCHAR(15) NOT NULL,
    ADD COLUMN usuario_id BIGINT NOT NULL;

ALTER TABLE fornecedores
    ADD CONSTRAINT fk_fornecedor_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios (usuario_id),

    ADD CONSTRAINT uk_fornecedor_email UNIQUE (email),
    ADD CONSTRAINT uk_fornecedor_usuario UNIQUE (usuario_id);

ALTER TABLE funcionarios
DROP
CONSTRAINT fk_funcionario_endereco;

ALTER TABLE funcionarios
DROP
COLUMN endereco_id;

ALTER TABLE redes_sociais
    ADD COLUMN plataforma VARCHAR(30),
    ADD COLUMN funcionario_id BIGINT;

ALTER TABLE redes_sociais
    ADD CONSTRAINT fk_rs_funcionario FOREIGN KEY (funcionario_id)
        REFERENCES funcionarios (funcionario_id);

-- =========================
-- ALTERAÇÕES
-- =========================


-- =========================
-- AGENDAMENTO X SERVIÇOS (associativa nova)
-- =========================
CREATE TABLE agendamentos_servicos
(
    agendamentos_servicos_id BIGSERIAL PRIMARY KEY,
    agendamento_id           BIGINT         NOT NULL,
    servico_id               BIGINT         NOT NULL,
    preco                    NUMERIC(10, 2) NOT NULL,
    duracao                  INTEGER        NOT NULL,

    CONSTRAINT fk_as_agendamento FOREIGN KEY (agendamento_id)
        REFERENCES agendamentos (agendamento_id),

    CONSTRAINT fk_as_servico FOREIGN KEY (servico_id)
        REFERENCES servicos (servico_id),

    CONSTRAINT uk_agendamento_servico
        UNIQUE (agendamento_id, servico_id)
);

-- =========================
-- ESTOQUES
-- =========================
CREATE TABLE estoques
(
    estoque_id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL,

    CONSTRAINT fk_estoque_empresa FOREIGN KEY (empresa_id)
        REFERENCES empresas (empresa_id)
);

-- =========================
-- PEDIDOS
-- =========================
CREATE TABLE pedidos
(
    pedido_id     BIGSERIAL PRIMARY KEY,
    data          DATE        NOT NULL,
    status        VARCHAR(30) NOT NULL,
    empresa_id    BIGINT      NOT NULL,
    fornecedor_id BIGINT      NOT NULL,

    CONSTRAINT fk_pedido_empresa FOREIGN KEY (empresa_id)
        REFERENCES empresas (empresa_id),

    CONSTRAINT fk_pedido_fornecedor FOREIGN KEY (fornecedor_id)
        REFERENCES fornecedores (fornecedor_id)
);

-- =========================
-- PAGAMENTOS
-- =========================
CREATE TABLE pagamentos
(
    pagamento_id    BIGSERIAL PRIMARY KEY,
    data_pagamento  DATE           NOT NULL,
    valor           NUMERIC(10, 2) NOT NULL,
    status          VARCHAR(30)    NOT NULL,
    forma_pagamento VARCHAR(50)    NOT NULL,
    agendamento_id  BIGINT,
    pedido_id       BIGINT,

    CONSTRAINT fk_pagamento_agendamento FOREIGN KEY (agendamento_id)
        REFERENCES agendamentos (agendamento_id),

    CONSTRAINT fk_pagamento_pedido FOREIGN KEY (pedido_id)
        REFERENCES pedidos (pedido_id)
);

-- =========================
-- PRODUTO X PEDIDO
-- =========================
CREATE TABLE itens_pedido
(
    item_pedido_id BIGSERIAL PRIMARY KEY,
    pedido_id      BIGINT         NOT NULL,
    produto_id     BIGINT         NOT NULL,
    quantidade     INTEGER        NOT NULL,
    valor_unitario NUMERIC(10, 2) NOT NULL,
    valor_total    NUMERIC(10, 2) NOT NULL,

    CONSTRAINT fk_ip_pedido FOREIGN KEY (pedido_id)
        REFERENCES pedidos (pedido_id),

    CONSTRAINT fk_ip_produto FOREIGN KEY (produto_id)
        REFERENCES produtos (produto_id),

    CONSTRAINT uk_pedido_produto UNIQUE (pedido_id, produto_id)
);

-- =========================
-- PRODUTO X FORNECEDOR
-- =========================
CREATE TABLE itens_fornecedor
(
    item_fornecedor_id BIGSERIAL PRIMARY KEY,
    produto_id         BIGINT         NOT NULL,
    fornecedor_id      BIGINT         NOT NULL,
    preco_fornecedor   NUMERIC(10, 2) NOT NULL,

    CONSTRAINT fk_if_produto FOREIGN KEY (produto_id)
        REFERENCES produtos (produto_id),

    CONSTRAINT fk_if_fornecedor FOREIGN KEY (fornecedor_id)
        REFERENCES fornecedores (fornecedor_id),

    CONSTRAINT uk_produto_fornecedor
        UNIQUE (produto_id, fornecedor_id)
);

-- =========================
-- PRODUTO X ESTOQUE
-- =========================
CREATE TABLE itens_estoque
(
    item_estoque_id BIGSERIAL PRIMARY KEY,
    estoque_id      BIGINT         NOT NULL,
    produto_id      BIGINT         NOT NULL,
    quantidade      INTEGER        NOT NULL,
    preco_venda     NUMERIC(10, 2) NOT NULL,

    CONSTRAINT fk_ie_estoque FOREIGN KEY (estoque_id)
        REFERENCES estoques (estoque_id),

    CONSTRAINT fk_ie_produto FOREIGN KEY (produto_id)
        REFERENCES produtos (produto_id),

    CONSTRAINT uk_produto_estoque
        UNIQUE (produto_id, estoque_id)
);