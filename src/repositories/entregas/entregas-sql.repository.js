import { pool } from "../../database/postgres.js";
import { IEntregasRepository } from "./ientregas.repository.js";
/** @import { IEntregasRepository } from './ientregas.repository.js' */

/**
 * @extends {IEntregasRepository}
 */
export class EntregasRepositorySQL extends IEntregasRepository {
	async listarTodos({ descricao, origem, destino, status, motoristaId } = {}) {
		let query = "SELECT * FROM ENTREGAS";
		let condicoes = [];
		let params = [];

		if (descricao) {
			params.push(descricao);
			condicoes.push(`descricao = $${params.length}`);
		}

		if (origem) {
			params.push(origem);
			condicoes.push(`origem = $${params.length}`);
		}

		if (destino) {
			params.push(destino);
			condicoes.push(`destino = $${params.length}`);
		}

		if (status) {
			const lista = Array.isArray(status) ? status : [status];
			// a idea é criar algo como status in (?, ?) dependendo da quantidade de objetos na lista
			const placeholders = lista
				.map((_, idx) => `$${params.length + idx + 1}`)
				.join(", ");
			condicoes.push(`status in (${placeholders})`);
			params.push(...lista);
		}

		if (motoristaId) {
			params.push(motoristaId);
			condicoes.push(`motorista_id = $${params.length}`);
		}

		if (condicoes.length > 0) {
			query += " WHERE " + condicoes.join(" AND ");
		}

		return (await pool.query(query, params)).rows;
	}

	async buscarPorId(id) {
		const { rows } = await pool.query(
			"SELECT * FROM ENTREGAS WHERE ID = $1",
			[id],
		);
		return rows ?? null;
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
