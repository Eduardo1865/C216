import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.cpf import router as cpf_router
from app.api.routes.people import router as people_router
from app.api.routes.user import router as user_router
from app.api.routes.users import router as users_router

app = FastAPI(title="C216 Backend")
cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(cpf_router)
app.include_router(people_router)
app.include_router(users_router)
app.include_router(user_router)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
