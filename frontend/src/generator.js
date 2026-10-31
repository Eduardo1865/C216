const firstNames = [
  "Ana",
  "Beatriz",
  "Bruno",
  "Camila",
  "Daniel",
  "Eduardo",
  "Fernanda",
  "Gabriel",
  "Helena",
  "João",
  "Laura",
  "Lucas",
  "Mariana",
  "Rafael",
  "Sofia",
];
const lastNames = [
  "Almeida",
  "Barbosa",
  "Cardoso",
  "Costa",
  "Gomes",
  "Lima",
  "Martins",
  "Mendes",
  "Oliveira",
  "Pereira",
  "Ribeiro",
  "Santos",
  "Silva",
  "Souza",
];
const streets = [
  "Rua das Flores",
  "Avenida Brasil",
  "Rua do Comércio",
  "Avenida Central",
  "Rua das Palmeiras",
];

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function digits(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

export function generateCpf() {
  const base = digits(9).split("").map(Number);
  const firstDigit = calculateCpfDigit(base);
  const secondDigit = calculateCpfDigit([...base, firstDigit]);
  const value = [...base, firstDigit, secondDigit].join("");
  return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
}

function calculateCpfDigit(value) {
  const weight = value.length + 1;
  const sum = value.reduce(
    (total, digit, index) => total + digit * (weight - index),
    0,
  );
  const remainder = (sum * 10) % 11;
  return remainder === 10 ? 0 : remainder;
}

export function generateName() {
  return `${pick(firstNames)} ${pick(lastNames)}`;
}

export function generateEmail() {
  const name = generateName()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(" ", ".");
  return `${name}${Math.floor(Math.random() * 100)}@exemplo.com`;
}

export function generateFullPerson() {
  const name = generateName();
  const emailName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(" ", ".");
  return {
    nome: name,
    cpf: generateCpf(),
    email: `${emailName}@exemplo.com`,
    telefone: `(31) 9${digits(4)}-${digits(4)}`,
    endereco: `${pick(streets)}, ${Math.floor(Math.random() * 900) + 100} - Belo Horizonte, MG`,
  };
}
