function ItemList({ items }) {
  return (
    <section className="item-list" aria-labelledby="list-title">
      <div className="list-heading">
        <h2 id="list-title">Itens cadastrados</h2>
        <span>{items.length}</span>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">Nenhum item cadastrado ainda.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong>
              <span>{item.description}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ItemList;
