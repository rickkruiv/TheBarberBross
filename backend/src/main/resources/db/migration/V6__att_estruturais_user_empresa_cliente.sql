ALTER TABLE usuarios
    ADD COLUMN empresa_id BIGINT,
    ADD COLUMN ativo BOOLEAN,

    ADD CONSTRAINT fk_usuario_empresa FOREIGN KEY (empresa_id) REFERENCES empresas (empresa_id);

ALTER TABLE clientes
    ADD COLUMN ativo BOOLEAN;

ALTER TABLE servicos
    ADD COLUMN empresa_id BIGINT,

    ADD CONSTRAINT fk_servico_empresa FOREIGN KEY (empresa_id) REFERENCES empresas (empresa_id);

UPDATE servicos
SET empresa_id = 1;

UPDATE clientes
SET ativo = true;

UPDATE usuarios
SET empresa_id = 1
WHERE usuario_id IN (1, 2);

UPDATE usuarios
SET empresa_id = 2
WHERE usuario_id = 4;

UPDATE usuarios
SET ativo = true;

ALTER TABLE empresas
    ADD COLUMN ativa BOOLEAN;

UPDATE empresas
SET ativa = true;

ALTER TABLE empresas
    ALTER COLUMN ativa SET NOT NULL;