.PHONY: install test lint format run help build up down logs clean

PYTEST := poetry run pytest
UVICORN := poetry run uvicorn

install:
	poetry install

test:
	$(PYTEST)

lint:
	poetry run ruff check .

format:
	poetry run ruff format .

run:
	$(UVICORN) app.main:app --reload

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
	@echo "Comandos Python:"
	@echo "  make install       - instala dependências"
	@echo "  make test          - executa testes"
	@echo "  make lint          - verifica código"
	@echo "  make format        - formata código"
	@echo "  make run           - inicia servidor localmente"
	@echo ""
	@echo "Comandos Docker:"
	@echo "  make build         - constrói imagens Docker"
	@echo "  make up            - inicia serviços (backend + database)"
	@echo "  make down          - para serviços"
	@echo "  make logs          - visualiza logs do backend"
	@echo "  make clean         - remove containers, volumes e cache"
