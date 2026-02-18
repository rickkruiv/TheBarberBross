-- =========================
-- ENDERECOS
-- =========================
CREATE TABLE enderecos
(
    endereco_id BIGSERIAL PRIMARY KEY,
    cep         VARCHAR(9)   NOT NULL,
    logradouro  VARCHAR(255) NOT NULL,
    complemento VARCHAR(255),
    numero      VARCHAR(20)  NOT NULL,
    cidade      VARCHAR(100) NOT NULL,
    bairro      VARCHAR(100) NOT NULL,
    uf          CHAR(2)      NOT NULL
);

-- =========================
-- EMPRESAS
-- =========================
CREATE TABLE empresas
(
    empresa_id      BIGSERIAL PRIMARY KEY,
    razao_social    VARCHAR(255) NOT NULL,
    nome_fantasia   VARCHAR(255) NOT NULL,
    cnpj            VARCHAR(18)  NOT NULL UNIQUE,
    telefone        VARCHAR(15)  NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    tipo_assinatura VARCHAR(30)  NOT NULL,
    endereco_id     BIGINT UNIQUE,

    CONSTRAINT fk_empresa_endereco
        FOREIGN KEY (endereco_id)
            REFERENCES enderecos (endereco_id)
);

-- =========================
-- CLIENTES
-- =========================
CREATE TABLE clientes
(
    cliente_id BIGSERIAL PRIMARY KEY,
    nome       VARCHAR(50)  NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    senha      VARCHAR(50)  NOT NULL,
    telefone   VARCHAR(15)  NOT NULL
);

-- =========================
-- FUNCIONARIOS
-- =========================
CREATE TABLE funcionarios
(
    funcionario_id BIGSERIAL PRIMARY KEY,
    nome           VARCHAR(50)  NOT NULL,
    cpf            VARCHAR(14)  NOT NULL UNIQUE,
    rg             VARCHAR(12) UNIQUE,
    telefone       VARCHAR(15)  NOT NULL,
    email          VARCHAR(100) NOT NULL UNIQUE,
    nascimento     DATE,
    estado_civil   VARCHAR(30),
    endereco_id    BIGINT,

    CONSTRAINT fk_funcionario_endereco
        FOREIGN KEY (endereco_id)
            REFERENCES enderecos (endereco_id)
);

-- =========================
-- USUARIOS
-- =========================
CREATE TABLE usuarios
(
    usuario_id     BIGSERIAL PRIMARY KEY,
    username       VARCHAR(20)  NOT NULL UNIQUE,
    senha          VARCHAR(255) NOT NULL,
    nivel_acesso   VARCHAR(30)  NOT NULL,
    funcionario_id BIGINT UNIQUE,

    CONSTRAINT fk_usuario_funcionario
        FOREIGN KEY (funcionario_id)
            REFERENCES funcionarios (funcionario_id)
);

-- =========================
-- CARGOS
-- =========================
CREATE TABLE cargos
(
    cargo_id     BIGSERIAL PRIMARY KEY,
    nome         VARCHAR(50)    NOT NULL UNIQUE,
    salario_base NUMERIC(10, 2) NOT NULL,
    ativo        BOOLEAN        NOT NULL DEFAULT TRUE
);

-- =========================
-- CARGOS_FUNCIONARIO
-- =========================
CREATE TABLE cargos_funcionario
(
    cargo_funcionario_id BIGSERIAL PRIMARY KEY,
    funcionario_id       BIGINT      NOT NULL,
    cargo_id             BIGINT      NOT NULL,
    data_inicio          DATE        NOT NULL,
    data_fim             DATE,
    status               VARCHAR(30) NOT NULL,

    CONSTRAINT fk_cf_funcionario
        FOREIGN KEY (funcionario_id)
            REFERENCES funcionarios (funcionario_id),

    CONSTRAINT fk_cf_cargo
        FOREIGN KEY (cargo_id)
            REFERENCES cargos (cargo_id)
);

-- =========================
-- CATEGORIAS
-- =========================
CREATE TABLE categorias
(
    categoria_id BIGSERIAL PRIMARY KEY,
    nome         VARCHAR(50) NOT NULL,
    descricao    VARCHAR(100),
    tipo         VARCHAR(30) NOT NULL
);

-- =========================
-- SERVICOS
-- =========================
CREATE TABLE servicos
(
    servico_id   BIGSERIAL PRIMARY KEY,
    nome         VARCHAR(50)    NOT NULL,
    descricao    VARCHAR(100),
    preco        NUMERIC(10, 2) NOT NULL,
    duracao      INTEGER        NOT NULL,
    categoria_id BIGINT         NOT NULL,

    CONSTRAINT fk_servico_categoria
        FOREIGN KEY (categoria_id)
            REFERENCES categorias (categoria_id)
);

-- =========================
-- PRODUTOS
-- =========================
CREATE TABLE produtos
(
    produto_id   BIGSERIAL PRIMARY KEY,
    nome         VARCHAR(255) NOT NULL,
    descricao    VARCHAR(255),
    categoria_id BIGINT       NOT NULL,

    CONSTRAINT fk_produto_categoria
        FOREIGN KEY (categoria_id)
            REFERENCES categorias (categoria_id)
);

-- =========================
-- AGENDAMENTOS
-- =========================
CREATE TABLE agendamentos
(
    agendamento_id BIGSERIAL PRIMARY KEY,
    data_horario   TIMESTAMP      NOT NULL,
    status         VARCHAR(30)    NOT NULL,
    observacao     VARCHAR(100),
    valor_total    NUMERIC(10, 2) NOT NULL,

    cliente_id     BIGINT         NOT NULL,
    empresa_id     BIGINT         NOT NULL,
    funcionario_id BIGINT,

    CONSTRAINT fk_agendamento_cliente
        FOREIGN KEY (cliente_id)
            REFERENCES clientes (cliente_id),

    CONSTRAINT fk_agendamento_empresa
        FOREIGN KEY (empresa_id)
            REFERENCES empresas (empresa_id),

    CONSTRAINT fk_agendamento_funcionario
        FOREIGN KEY (funcionario_id)
            REFERENCES funcionarios (funcionario_id)
);

-- =========================
-- AGENDAMENTO x SERVICO
-- =========================
CREATE TABLE servico_agendamento
(
    agendamento_id BIGINT NOT NULL,
    servico_id     BIGINT NOT NULL,

    PRIMARY KEY (agendamento_id, servico_id),

    CONSTRAINT fk_sa_agendamento
        FOREIGN KEY (agendamento_id)
            REFERENCES agendamentos (agendamento_id),

    CONSTRAINT fk_sa_servico
        FOREIGN KEY (servico_id)
            REFERENCES servicos (servico_id)
);

-- =========================
-- AVALIACOES
-- =========================
CREATE TABLE avaliacoes
(
    avaliacao_id BIGSERIAL PRIMARY KEY,
    cliente_id   BIGINT    NOT NULL,
    empresa_id   BIGINT    NOT NULL,
    servico_id   BIGINT    NOT NULL,
    avaliacao    INTEGER   NOT NULL,
    comentario   TEXT,
    data         TIMESTAMP NOT NULL,

    CONSTRAINT fk_av_cliente
        FOREIGN KEY (cliente_id)
            REFERENCES clientes (cliente_id),

    CONSTRAINT fk_av_empresa
        FOREIGN KEY (empresa_id)
            REFERENCES empresas (empresa_id),

    CONSTRAINT fk_av_servico
        FOREIGN KEY (servico_id)
            REFERENCES servicos (servico_id)
);

-- =========================
-- REDES SOCIAIS
-- =========================
CREATE TABLE redes_sociais
(
    social_media_id BIGSERIAL PRIMARY KEY,
    url             VARCHAR(255) NOT NULL,
    empresa_id      BIGINT       NOT NULL,

    CONSTRAINT fk_rs_empresa
        FOREIGN KEY (empresa_id)
            REFERENCES empresas (empresa_id)
);

-- =========================
-- FORNECEDORES
-- =========================
CREATE TABLE fornecedores
(
    fornecedor_id BIGSERIAL PRIMARY KEY,
    nome             VARCHAR(255) NOT NULL,
    cnpj             VARCHAR(255) NOT NULL,
    email             VARCHAR(255) NOT NULL,
    endereco_id      BIGINT,

    CONSTRAINT fk_fornecedor_endereco
        FOREIGN KEY (endereco_id)
            REFERENCES enderecos (endereco_id)
);


