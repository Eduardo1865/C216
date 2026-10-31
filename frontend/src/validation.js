export function validateItem({ name, description }) {
  if (!name) {
    return "O nome é obrigatório.";
  }

  if (!description) {
    return "A descrição é obrigatória.";
  }

  return "";
}
