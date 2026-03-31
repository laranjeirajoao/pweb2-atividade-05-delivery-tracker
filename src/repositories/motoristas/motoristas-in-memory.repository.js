import { IMotoristasRepository } from "./imotoristas.repository.js";

/** @import { Database } from '../../database/database.js' */
/** @import { IMotoristasRepository } from './imotoristas.repository.js' */

/**
 * @extends {IMotoristasRepository}
 */

export class MotoristasRepositoryInMemory extends IMotoristasRepository {
	/**
	 * @param {Database} database
	 */
	constructor(database) {
		super();
		this.database = database;
	}

	async listarTodos() {
		return this.database.getMotoristas();
	}

	async buscarPorId(id) {
		return this.database.getMotoristas().find((x) => x.id === id) ?? null;
	}

	async buscarPorCPF(cpf) {
		return this.database.getMotoristas().find((x) => x.cpf === cpf) ?? null;
	}

	async criar(dados) {
		const novoMotorista = {
			...dados,
			id: this.database.generateId(),
		};
		this.database.getMotoristas().push(novoMotorista);
		return novoMotorista;
	}

	async atualizar(id, dados) {
		const indice = this.database
			.getMotoristas()
			.findIndex((u) => u.id === id);
		if (indice === -1) return null;
		this.database.getMotoristas()[indice] = {
			...this.database.getMotoristas()[indice],
			...dados,
			id,
		};
		return this.database.getMotoristas()[indice];
	}
}
