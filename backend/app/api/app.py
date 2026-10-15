from fastapi import FastAPI

from app.api.routes.cpf import router as cpf_router

app = FastAPI(title="C216 Backend")
app.include_router(cpf_router)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}