import { EntregaStatus } from "../utils/EntregaStatusEnum.js";

export class EntregasRepository {
	constructor(database) {
		this.database = database;
	}

	async listarTodos() {
		return this.database.getEntregas();
	}

	async buscarPorId(id) {
		return this.database.getEntregas().find((x) => x.id === id) ?? null;
	}

	async buscarPorDescricaoOrigemEDestino({ descricao, origem, destino }) {
		return this.database
			.getEntregas()
			.find(
				(x) =>
					x.descricao === descricao &&
					x.origem === origem &&
					x.destino === destino &&
					(x.status === EntregaStatus.CRIADA ||
						x.status === EntregaStatus.EM_TRANSITO),
			);
	}

	async criar(dados) {
		return this.database
			.getEntregas()
			.push({ id: this.database.generateId(), ...dados });
	}

	async atualizar(id, dados) {
		const indice = this.database.getEntregas().findIndex((u) => u.id === id);
		if (indice === -1) return null;
		this.database.getEntregas()[indice] = {
			...this.database.getEntregas()[indice],
			...dados,
			id,
		};
		return this.database.getEntregas()[indice];
	}

	async remover(id) {
		const indice = this.database.getEntregas().findIndex((u) => u.id === id);
		if (indice === -1) return false;
		this.database.getEntregas().splice(indice, 1);
		return true;
	}
}
