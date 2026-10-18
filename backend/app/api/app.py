from fastapi import FastAPI

from app.api.routes.cpf import router as cpf_router
from app.api.routes.user import router as user_router
from app.api.routes.users import router as users_router

app = FastAPI(title="C216 Backend")
app.include_router(cpf_router)
app.include_router(users_router)
app.include_router(user_router)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
