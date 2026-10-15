# C216

Repositório para a matéria C216.

## Testes

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
