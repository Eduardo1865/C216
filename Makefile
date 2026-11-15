
POETRY := poetry -C backend

backend-install:
	$(POETRY) install

backend-run:
	$(POETRY) run uvicorn app.main:app --reload

frontend-install:
	npm --prefix frontend ci

frontend-run:
	npm run dev --prefix frontend