import { IMotoristasRepository } from "./imotoristas.repository.js";

export class MotoristasRepositoryInMemory extends IMotoristasRepository {
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
		return this.database
			.getMotoristas()
			.push({ ...dados, id: this.database.generateId() });
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
