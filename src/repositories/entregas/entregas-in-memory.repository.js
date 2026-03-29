import { IEntregasRepository } from "./ientregas.repository.js";
/** @import { Database } from '../../database/database.js' */
/** @import { IEntregasRepository } from './ientregas.repository.js' */

/**
 * @extends {IEntregasRepository}
 */
export class EntregasRepositoryInMemory extends IEntregasRepository {
	/**
	 * @param {Database} database
	 */
	constructor(database) {
		super();
		this.database = database;
	}

	async listarTodos({ descricao, origem, destino, status, motoristaId } = {}) {
		return this.database.getEntregas().filter((entrega) => {
			if (descricao && entrega.descricao !== descricao) return false;
			if (origem && entrega.origem !== origem) return false;
			if (destino && entrega.destino !== destino) return false;
			if (status) {
				const statusList = Array.isArray(status) ? status : [status];
				if (!statusList.includes(entrega.status)) return false;
			}
			if (motoristaId && entrega.motoristaId !== motoristaId) return false;

			return true;
		});
	}

	async buscarPorId(id) {
		return this.database.getEntregas().find((x) => x.id === id) ?? null;
	}

	async criar(dados) {
		const novaEntrega = {
			...dados,
			motoristaId: null,
			id: this.database.generateId(),
		};
		this.database.getEntregas().push(novaEntrega);
		return novaEntrega;
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
