function HistoryList({ history, onClear, onSelect }) {
  return (
    <section className="history-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Seus últimos resultados</p>
          <h2>Histórico local</h2>
        </div>
        {history.length > 0 && (
          <button type="button" className="clear-button" onClick={onClear}>
            Limpar histórico
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="history-empty">
          <span>◷</span>
          <h3>Nenhum resultado ainda</h3>
          <p>Os dados gerados aparecerão aqui.</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <button
              type="button"
              className="history-item"
              key={item.id}
              onClick={() => onSelect(item)}
            >
              <span className="history-type">{item.label}</span>
              <strong>
                {typeof item.value === "string" ? item.value : item.value.nome}
              </strong>
              <span>→</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default HistoryList;
