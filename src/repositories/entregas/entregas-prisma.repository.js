import { prisma } from "../../database/prisma.js";
import { IEntregasRepository } from "./ientregas.repository.js";
/** @import { IEntregasRepository } from './ientregas.repository.js' */

/**
 * @extends {IEntregasRepository}
 */
export class EntregasRepositoryPrisma extends IEntregasRepository {
	async listarTodos({
		descricao,
		origem,
		destino,
		status,
		motoristaId,
		page = 1,
		limit = 10,
		createdDe,
		createdAte,
	} = {}) {
		const parsedPage = Number(page);
		const parsedLimit = Number(limit);

		page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

		limit =
			Number.isFinite(parsedLimit) && parsedLimit > 0
				? Math.min(parsedLimit, 50)
				: 10;

		const skip = (page - 1) * limit;

		const where = {
			...(descricao && { descricao }),
			...(origem && { origem }),
			...(destino && { destino }),
			...(status && {
				status: { in: Array.isArray(status) ? status : [status] },
			}),
			...(motoristaId && { motorista_id: motoristaId }),
			...((createdDe || createdAte) && {
				createdAt: {
					...(createdDe && { gte: createdDe }),
					...(createdAte && { lte: createdAte }),
				},
			}),
		};

		const [data, total] = await Promise.all([
			prisma.entrega.findMany({
				where,
				skip,
				take: limit,
				orderBy: { id: "asc" },
			}),
			prisma.entrega.count({ where }),
		]);

		return {
			data,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	async listarEntregasPorStatusAgrupados() {
		const resultado = await prisma.entrega.groupBy({
			by: ["status"],
			_count: true,
		});

		const base = {
			CRIADA: 0,
			EM_TRANSITO: 0,
			ENTREGUE: 0,
			CANCELADA: 0,
		};

		return resultado.reduce((acc, item) => {
			acc[item.status] = item._count;
			return acc;
		}, base);
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
				motorista_id: dados.motoristaId,
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
