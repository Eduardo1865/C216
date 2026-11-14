function GeneratorCard({ generator, onGenerate }) {
  return (
    <article className={`generator-card ${generator.color}`}>
      <div className="card-icon">{generator.icon}</div>
      <div className="card-content">
        <h2>{generator.label}</h2>
        <p>{generator.description}</p>
      </div>
      <button
        type="button"
        className="generate-button"
        aria-label={`Gerar ${generator.label}`}
        onClick={() => onGenerate(generator)}
      >
        Gerar agora <span>→</span>
      </button>
    </article>
  );
}

export default GeneratorCard;
