import pytest
from fastapi.testclient import TestClient

from app.main import app, format_cpf


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


def test_health_retorna_status(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200


def test_health_retorna_payload(client: TestClient) -> None:
    response = client.get("/health")

    assert response.json() == {"status": "ok"}


@pytest.mark.parametrize(
    ("path", "expected_status"),
    [("/health", 200), ("/unknown", 404)],
)
def test_endpoints_retornamStatus(
    client: TestClient, path: str, expected_status: int
) -> None:
    response = client.get(path)

    assert response.status_code == expected_status


@pytest.mark.parametrize(
    ("cpf", "expected"),
    [
        ("12345678909", "123.456.789-09"),
        ("00100200304", "001.002.003-04"),
    ],
)
def test_format_cpf_formataDigitos(cpf: str, expected: str) -> None:
    assert format_cpf(cpf) == expected


@pytest.mark.parametrize("cpf", ["1234567890", "123456789012", "123.456.789-09"])
def test_format_cpf_inputInvalido(cpf: str) -> None:
    with pytest.raises(ValueError, match="11 dígitos"):
        format_cpf(cpf)
