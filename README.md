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

## GitHub Actions

O workflow `.github/workflows/ci-backend.yml` instala o Python 3.13 e as dependências do backend com Poetry, e executa o Pytest automaticamente em:

- `push` na branch `main`
- abertura ou atualização de `pull request` para `main`
