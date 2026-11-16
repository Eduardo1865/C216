
POETRY := poetry -C backend

backend-install:
	$(POETRY) install

backend-run:
	$(POETRY) run uvicorn app.main:app --reload

frontend-install:
	npm --prefix frontend ci

frontend-run:
	npm run dev --prefix frontend




db-upgrade:
	docker-compose exec backend poetry run alembic upgrade head

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

clean:
	docker-compose down -v
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete