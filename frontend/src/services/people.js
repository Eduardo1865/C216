const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    let detail = "Não foi possível concluir a operação.";
    try {
      detail = (await response.json()).detail || detail;
    } catch {
      // Keep the generic message when the API does not return JSON.
    }
    throw new Error(detail);
  }

  return response.json();
}

export function listPeople() {
  return request("/people");
}

export function createPerson(person) {
  return request("/people", {
    method: "POST",
    body: JSON.stringify(person),
  });
}
