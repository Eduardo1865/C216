from fastapi import FastAPI
from app.routers.produtos import router as produtos_router

app = FastAPI(title="C216 Projeto Final")

app.include_router(produtos_router)