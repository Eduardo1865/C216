.PHONY: install test lint format run migrate frontend-install frontend-dev frontend-lint frontend-format frontend-check frontend-test frontend-e2e frontend-build check-all help build up down logs clean

PYTEST := poetry -C backend run pytest
UVICORN := poetry -C backend run uvicorn

install:
	poetry -C backend install

test:
	$(PYTEST)

lint:
	poetry -C backend run ruff check .

format:
	poetry -C backend run ruff format .

frontend-install:
	npm --prefix frontend ci

frontend-dev:
	npm --prefix frontend run dev

frontend-lint:
	npm --prefix frontend run lint

frontend-format:
	npm --prefix frontend run format

frontend-check:
	npm --prefix frontend run check

frontend-test:
	npm --prefix frontend test

frontend-e2e:
	npm --prefix frontend run test:e2e

frontend-build:
	npm --prefix frontend run build

check-all: frontend-check frontend-test frontend-build test lint

run:
	$(UVICORN) app.main:app --reload

migrate:
	poetry -C backend run alembic upgrade head

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f backend

clean:
	docker-compose down -v
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

help:
	@echo "Comandos backend:"
	@echo "  make install          - instala dependências Python"
	@echo "  make test             - executa testes do backend"
	@echo "  make lint             - verifica código do backend"
	@echo "  make format           - formata código do backend"
	@echo "  make run              - inicia o backend localmente"
	@echo ""
	@echo "Comandos frontend:"
	@echo "  make frontend-install - instala dependências npm"
	@echo "  make frontend-dev     - inicia o Vite"
	@echo "  make frontend-lint    - executa o lint do Biome"
	@echo "  make frontend-format  - formata o frontend"
	@echo "  make frontend-check   - executa o Biome check"
	@echo "  make frontend-test    - executa testes unitários e integração"
	@echo "  make frontend-e2e     - executa testes Playwright"
	@echo "  make frontend-build   - gera o build de produção"
	@echo "  make check-all        - executa validações de backend e frontend"
	@echo ""
	@echo "Comandos Docker:"
	@echo "  make build         - constrói imagens Docker"
	@echo "  make up            - inicia serviços (backend + database)"
	@echo "  make down          - para serviços"
	@echo "  make logs          - visualiza logs do backend"
	@echo "  make clean         - remove containers, volumes e cache"
