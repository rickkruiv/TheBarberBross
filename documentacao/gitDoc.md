# 📦 Git Workflow e Padrões de Contribuição

Este documento descreve o fluxo de trabalho utilizando **Git + GitHub** no projeto, incluindo:

- Padrão de branches
- Padrão de commits (Jira)
- Processo de clone
- Fluxo de push e pull
- Processo de merge entre branches

# 🌳 Estrutura de Branches

O projeto utiliza **3 níveis de branches**:

```bash
producao
↑
desenvolvimento
↑
JIRA-ID-DescricaoDaTarefa
```

## Branches principais

### `producao`
- Contém **código estável**
- Representa a **versão em produção**
- Só recebe merge da `desenvolvimento` após testes

### `desenvolvimento`
- Branch principal de **desenvolvimento**
- Todas as novas funcionalidades são integradas aqui
- Utilizada para **testes antes da produção**

## Branches de tarefa (feature)

Cada tarefa do **Jira** deve ter sua própria branch.

### Padrão de nome

- JIRA-ID-DescricaoDaTarefa 

### Exemplos:

- BB-1-AutenticacaoJWT
- BB-2-IntegracaoFrontBack
- BB-3-CriacaoTelaHomeMobile

# 📝 Padrão de Commit

Todos os commits devem ter uma **BREVE EXPLICAÇÃO DA TAREFA**, não sendo necessário utilizar o padrão do Jira.

### Exemplos:

- Alterada label do formulario de agendamento
- Corrigido total por barbeiro mensal no dashboard
- Incluido coluna "status" na tabela de consulta de agendamentos

# ⬇️ Clonando o Repositório

Para começar a trabalhar no projeto:

```bash
git clone https://github.com/ORGANIZACAO/NOME-REPOSITORIO.git
```

Entrar na pasta do projeto:
```bash
cd NOME-REPOSITORIO
```

# 🔄 Atualizando o Projeto (Pull)

Antes de começar qualquer tarefa, atualize sua branch local:

```bash
git checkout desenvolvimento
git pull origin desenvolvimento
```

# 🌱 Criando uma Branch de Tarefa

Sempre criar a branch a partir da desenvolvimento.

```bash
git checkout desenvolvimento
git pull origin desenvolvimento
git checkout -b BB-1-AutenticacaoJWT
```

# 💾 Fazendo Commit

Adicionar arquivos modificados:

```bash
git add .
```

Criando commit:

```bash
git commit -m "Adicionado autenticacao JWT ao sistema"
```

## ⬆️ Enviando para o GitHub (Push)

Primeiro **pull** da branch HEAD para atualizar a branch e resolver conflitos:

```bash
git pull origin HEAD
```

Em seguida **push** da branch:
```bash
git push origin BB-1-AutenticacaoJWT
```

Depois disso, abra um Pull Request no GitHub para a branch `desenvolvimento`.

# 🔀 Fluxo de Merge

O fluxo de merge do projeto funciona da seguinte forma:

```bash
feature -> desenvolvimento -> producao
```

### Passo 1 - Desenvolvimento

Branches de tarefa são mergeadas em:

```bash
desenvolvimento
```

### Passo 2 - Testes

A branch desenvolvimento deve ser testada.

Se tudo estiver funcionando corretamente, ela será mergeada para:

```bash
producao
```

### Passo 3 - Produção

Merge final:

```bash
desenvolvimento -> producao
```

Essa branch representa a versão estável do sistema.

# 📊 Resumo do Fluxo
1. **Criar branch a partir da desenvolvimento**

    ```bash
    desenvolvimento
       └── BB-XX-NomeDaTarefa
    ```

2. **Desenvolver e fazer commits**

3. **Push da feature**

4. **Pull Request para desenvolvimento**

5. **Testes na desenvolvimento**

6. **Merge e Pull Request desenvolvimento -> producao**

# 👨‍💻 Exemplo de Fluxo Completo

```bash
git checkout desenvolvimento
git pull origin desenvolvimento

git checkout -b BB-11-LoadBalance

git add .
git commit -m "Configurado Load Balance"

git pull origin HEAD

git push origin BB-11-LoadBalance
```

Abrir Pull Request → desenvolvimento

Após testes: desenvolvimento → producao

# ⚠️ Boas Práticas

- **SEMPRE** ponterar e atualizar a desenvolvimento antes de criar uma nova branch
- **NUNCA** commitar diretamente na desenvolvimento e, **PRINCIPALMENTE**, na producao
- Usar o ID do Jira em **TODAS** as branchs
- Manter commits pequenos e descritivos
- Testar antes de abrir Pull Request

# 🧩 Tarefas do mesmo escopo podem compartilhar a branch

Além de refatorações e ajustes técnicos, é permitido que mais de uma tarefa do Jira seja desenvolvida na mesma branch quando elas pertencem ao mesmo contexto funcional da aplicação.

### Como nomear a branch nesse caso?

Use o ID da tarefa principal ou a que iniciou o desenvolvimento.
