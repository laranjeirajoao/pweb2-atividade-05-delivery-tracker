import { pool } from "../../database/postgres.js";
import { IMotoristasRepository } from "./imotoristas.repository.js";

/** @import { IMotoristasRepository } from './imotoristas.repository.js' */

/**
 * @extends {IMotoristasRepository}
 */

export class MotoristasRepositorySQL extends IMotoristasRepository {
	async listarTodos() {
		return (await pool.query("SELECT * FROM MOTORISTAS")).rows;
	}

	async buscarPorId(id) {
		const { rows } = await pool.query(
			"SELECT * FROM MOTORISTAS WHERE id = $1",
			[id],
		);
		return rows[0] ?? null;
	}

	async buscarPorCPF(cpf) {
		const { rows } = await pool.query(
			"SELECT * FROM MOTORISTAS WHERE cpf = $1",
			[cpf],
		);
		return rows[0] ?? null;
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
