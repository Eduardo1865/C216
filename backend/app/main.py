from fastapi import FastAPI

app = FastAPI(title="C216 Backend")


def format_cpf(cpf: str) -> str:
    if not cpf.isdigit() or len(cpf) != 11:
        raise ValueError("CPF deve conter exatamente 11 dígitos")

    return f"{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:]}"


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
