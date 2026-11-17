from fastapi import FastAPI
from app.routers.produtos import router as produtos_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="C216 Projeto Final")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(produtos_router)