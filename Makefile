
POETRY := poetry -C backend

backend-install:
	$(POETRY) install

backend-run:
	$(POETRY) run uvicorn app.main:app --reload

frontend-install:
	npm --prefix frontend ci

frontend-run:
	npm run dev --prefix frontend

db-run:
	docker compose up -d db

create-tables:
	poetry -C backend run alembic revision --autogenerate -m "create all tables"

migrate:
	poetry -C backend run alembic upgrade head

db-upgrade:
	docker-compose exec backend poetry run alembic upgrade head

ps:
	docker-compose ps

view-tables:
	docker compose exec db psql -U admin -d c216-projeto-final -c "\dt"

build:
	docker-compose build

up:
	docker-compose up -d

up-build:
	docker-compose up -d --build

down:
	docker-compose down

logs:
	docker-compose logs -f backend

clean-db:
	docker compose exec db psql -U admin -d c216-projeto-final -c "TRUNCATE TABLE produto RESTART IDENTITY;"

clean:
	docker-compose down -v
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

test-backend:
	$(POETRY) run pytest