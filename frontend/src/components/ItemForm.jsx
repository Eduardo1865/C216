import { useState } from "react";

function ItemForm({ onSubmit, error }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ name: name.trim(), description: description.trim() });
    setName("");
    setDescription("");
  }

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <label htmlFor="item-name">Nome</label>
      <input
        id="item-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Ex.: Estudar React"
      />

      <label htmlFor="item-description">Descrição</label>
      <textarea
        id="item-description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Descreva o item"
        rows="3"
      />

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button type="submit">Adicionar item</button>
    </form>
  );
}

export default ItemForm;
