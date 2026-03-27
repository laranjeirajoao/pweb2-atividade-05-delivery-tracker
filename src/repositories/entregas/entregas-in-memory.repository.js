import { IEntregasRepository } from "./ientregas.repository.js";

export class EntregasRepositoryInMemory extends IEntregasRepository {
	constructor(database) {
		super();
		this.database = database;
	}

	async listarTodos({ descricao, origem, destino, status } = {}) {
		return this.database.getEntregas().filter((entrega) => {
			if (descricao && entrega.descricao !== descricao) return false;
			if (origem && entrega.origem !== origem) return false;
			if (destino && entrega.destino !== destino) return false;
			if (status) {
				const statusList = Array.isArray(status) ? status : [status];
				if (!statusList.includes(entrega.status)) return false;
			}
			return true;
		});
	}

	async buscarPorId(id) {
		return this.database.getEntregas().find((x) => x.id === id) ?? null;
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
}
