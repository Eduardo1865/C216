# C216

Repositório para a matéria C216.

## Pré-requisitos

- Python com Poetry instalado.
- Node.js e npm instalados.
- Docker e Docker Compose, caso queira executar o banco e os serviços.

## Instalação

Para instalar as dependências do backend e do frontend:

```bash
make install
make frontend-install
```

O frontend é uma aplicação React com Vite, Tailwind CSS v4 e Biome. Ele
funciona de forma independente e, atualmente, usa apenas dados gerados
localmente, sem chamadas ao backend.

## Frontend

Para iniciar a interface em modo de desenvolvimento:

```bash
make frontend-dev
```

Geradores disponíveis:

- CPF válido formatado.
- E-mail fictício.
- Nome brasileiro.
- Pessoa completa com nome, CPF, e-mail, telefone e endereço.

A interface também possui cópia do resultado, histórico local e layout
responsivo. Os dados não são enviados para nenhum servidor.

## Testes e qualidade

Com as dependências instaladas, execute os comandos abaixo:

```bash
make frontend-check
make frontend-test
make frontend-build
make frontend-e2e
```

O comando `make check-all` executa as validações do frontend e do backend.

## Testes do backend

Com o Poetry instalado, execute na raiz do projeto:

```bash
make install
make test
```

Para executar diretamente no backend:

```bash
cd backend
poetry install
poetry run pytest
```

## Banco de dados

O `docker-compose.yml` inicia o PostgreSQL e configura a aplicação com a
variável `DATABASE_URL`. Ao iniciar o backend pelo Compose, as migrações
Alembic são aplicadas automaticamente. Para executar uma migração manualmente:

```bash
make up
make migrate
```

A API de usuários usa SQLAlchemy, um repository para acesso aos dados e o
serviço expõe o CRUD persistido em PostgreSQL:

- `POST /users` cria um usuário com `name` e `email`.
- `GET /users` lista os usuários.
- `GET /users/{id}` consulta um usuário.
- `PUT /users/{id}` atualiza `name` e/ou `email`.
- `DELETE /users/{id}` remove um usuário.

## API de CPF

- `GET /cpf/validate?cpf=...` valida um CPF por query parameter.
- `POST /cpf/validate` valida um CPF enviado como `{"cpf": "..."}`.
- `GET /cpf/generate` ou `POST /cpf` gera um CPF válido.
- `PUT /cpf/format` formata um CPF enviado no corpo da requisição.
- `PATCH /cpf/validate` valida um CPF enviado no corpo da requisição.
- `DELETE /cpf/{cpf}` remove um CPF gerado durante a execução.

## GitHub Actions

O workflow `.github/workflows/ci-backend.yml` instala o Python 3.13 e as dependências do backend com Poetry, e executa o Pytest automaticamente em:

- `push` na branch `main`
- abertura ou atualização de `pull request` para `main`
