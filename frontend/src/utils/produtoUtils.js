export function dataValidadeVencida(dataValidade) {
	if (!dataValidade) return false;

	const hoje = new Date();
	hoje.setHours(0, 0, 0, 0);

	const validade = new Date(`${dataValidade}T00:00:00`);
	return !Number.isNaN(validade.getTime()) && validade < hoje;
}
