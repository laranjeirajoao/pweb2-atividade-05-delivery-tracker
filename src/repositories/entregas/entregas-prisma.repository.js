import { prisma } from "../../database/prisma.js";
import { IEntregasRepository } from "./ientregas.repository.js";
/** @import { IEntregasRepository } from './ientregas.repository.js' */

/**
 * @extends {IEntregasRepository}
 */
export class EntregasRepositoryPrisma extends IEntregasRepository {
	async listarTodos({ descricao, origem, destino, status, motoristaId } = {}) {
		const where = {
			...(descricao && { descricao }),
			...(origem && { origem }),
			...(destino && { destino }),
			...(status && {
				status: { in: Array.isArray(status) ? status : [status] },
			}),
			...(motoristaId && { motorista_id: motoristaId }),
		};

		return await prisma.entrega.findMany({ where });
	}

	async listarEntregasPorStatusAgrupados() {
		// todo
	}

	async buscarPorId(id) {
		// todo
	}

	async criar(dados) {
		// todo
	}

	async atualizar(id, dados) {
		// todo
	}
}
