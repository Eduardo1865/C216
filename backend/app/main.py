from fastapi import FastAPI

app = FastAPI(title="C216 Backend")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
