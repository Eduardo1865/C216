from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_validate_cpf_with_query_parameter() -> None:
    response = client.get("/cpf/validate", params={"cpf": "12345678909"})

    assert response.status_code == 200
    assert response.json() == {"cpf": "12345678909", "valid": True}


def test_validate_cpf_with_request_body() -> None:
    response = client.post("/cpf/validate", json={"cpf": "12345678900"})

    assert response.status_code == 200
    assert response.json() == {"cpf": "12345678900", "valid": False}


def test_generate_cpf() -> None:
    response = client.get("/cpf/generate")

    assert response.status_code == 200
    assert response.json()["cpf"].isdigit()
    assert response.json()["formatted_cpf"]


def test_create_format_patch_and_delete_cpf() -> None:
    created = client.post("/cpf")
    cpf = created.json()["cpf"]

    assert created.status_code == 201
    assert client.put("/cpf/format", json={"cpf": cpf}).status_code == 200
    assert client.patch("/cpf/validate", json={"cpf": cpf}).status_code == 200
    assert client.delete(f"/cpf/{cpf}").status_code == 204