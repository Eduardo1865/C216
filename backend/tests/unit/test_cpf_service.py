import pytest

from app.services.cpf import format_cpf, generate_cpf, is_valid_cpf


@pytest.mark.parametrize("cpf", ["12345678909", "52998224725", "123.456.789-09"])
def test_is_valid_cpf_accepts_valid_cpfs(cpf: str) -> None:
    assert is_valid_cpf(cpf)


@pytest.mark.parametrize("cpf", ["12345678900", "11111111111", "1234567890", "abc"])
def test_is_valid_cpf_rejects_invalid_cpfs(cpf: str) -> None:
    assert not is_valid_cpf(cpf)


def test_format_cpf_formats_digits() -> None:
    assert format_cpf("12345678909") == "123.456.789-09"


def test_generate_cpf_returns_valid_digits() -> None:
    cpf = generate_cpf()

    assert len(cpf) == 11
    assert cpf.isdigit()
    assert is_valid_cpf(cpf)