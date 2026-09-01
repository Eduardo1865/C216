.PHONY: install test lint format run help

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

help:
	@echo "Comandos disponíveis: "
	@echo " make install - instala dependencias"
	@echo "make lint" - verifica código
	@echo "make format - formata código"
	@echo "make run - inicia servidor"

hello:
	echo "Olá"
