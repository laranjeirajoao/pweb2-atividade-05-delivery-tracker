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
		return await prisma.entrega.groupBy({
			by: "status",
			_count: true,
		});
	}

	async buscarPorId(id) {
		return await prisma.entrega.findUnique({
			where: { id },
			include: { historico: true, motorista: true },
		});
	}

	async criar(dados) {
		return await prisma.entrega.create({
			data: {
				descricao: dados.descricao,
				destino: dados.destino,
				origem: dados.origem,
				status: dados.status,
				historico: {
					create: dados.historico.map((item) => {
						return { descricao: item.descricao };
					}),
				},
			},
		});
	}

	async atualizar(id, dados) {
		return await prisma.entrega.update({
			where: { id },
			data: {
				descricao: dados.descricao,
				destino: dados.destino,
				origem: dados.origem,
				status: dados.status,
				historico: {
					update: dados.historico
						.filter((item) => item.id)
						.map((item) => ({
							where: { id: item.id },
							data: { descricao: item.descricao },
						})),
					create: dados.historico
						.filter((item) => !item.id)
						.map((item) => ({ descricao: item.descricao })),
				},
			},
		});
	}
}
