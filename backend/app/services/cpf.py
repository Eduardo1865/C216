import random
import re


def normalize_cpf(cpf: str) -> str:
    digits = re.sub(r"\D", "", cpf)
    if len(digits) != 11 or (
        digits != cpf and not re.fullmatch(r"\d{3}\.\d{3}\.\d{3}-\d{2}", cpf)
    ):
        raise ValueError("CPF deve conter exatamente 11 dígitos")
    return digits


def _calculate_digit(cpf_digits: str) -> str:
    weight = len(cpf_digits) + 1
    total = sum(int(digit) * (weight - index) for index, digit in enumerate(cpf_digits))
    remainder = total % 11
    return "0" if remainder < 2 else str(11 - remainder)


def is_valid_cpf(cpf: str) -> bool:
    try:
        digits = normalize_cpf(cpf)
    except ValueError:
        return False

    if len(set(digits)) == 1:
        return False

    return (
        _calculate_digit(digits[:9]) == digits[9]
        and _calculate_digit(digits[:10]) == digits[10]
    )


def format_cpf(cpf: str) -> str:
    digits = normalize_cpf(cpf)
    return f"{digits[:3]}.{digits[3:6]}.{digits[6:9]}-{digits[9:]}"


def generate_cpf() -> str:
    digits = "".join(str(random.randint(0, 9)) for _ in range(9))
    first_digit = _calculate_digit(digits)
    second_digit = _calculate_digit(digits + first_digit)
    return digits + first_digit + second_digit