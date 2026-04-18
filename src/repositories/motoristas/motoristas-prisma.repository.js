import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { EntregaStatus } from "../../../prisma/generated/prisma/index.js";
import { prisma } from "../../database/prisma.js";
import { MotoristaDuplicadoException } from "../../exceptions/MotoristaDuplicadoException.js";
import { IMotoristasRepository } from "./imotoristas.repository.js";

/** @import { IMotoristasRepository } from './imotoristas.repository.js' */

/**
 * @extends {IMotoristasRepository}
 */

export class MotoristasRepositoryPrisma extends IMotoristasRepository {
	async listarTodos() {
		return await prisma.motorista.findMany();
	}

	async buscarPorId(id) {
		return await prisma.motorista.findUnique({
			where: { id },
			include: { entregas: true },
		});
	}

	async buscarPorCPF(cpf) {
		return await prisma.motorista.findUnique({
			where: { cpf },
			include: { entregas: true },
		});
	}

	async listarMotoristasComEntregasAtivas() {
		const resultado = await prisma.motorista.findMany({
			where: {
				entregas: {
					some: {
						status: {
							notIn: [EntregaStatus.ENTREGUE, EntregaStatus.CANCELADA],
						},
					},
				},
			},
			select: {
				id: true,
				nome: true,
				cpf: true,
				placa_veiculo: true,
				_count: {
					select: {
						entregas: {
							where: {
								status: {
									notIn: [
										EntregaStatus.ENTREGUE,
										EntregaStatus.CANCELADA,
									],
								},
							},
						},
					},
				},
			},
		});
		return resultado.map((item) => ({
			id: item.id,
			nome: item.nome,
			cpf: item.cpf,
			placa_veiculo: item.placa_veiculo,
			entregasEmAberto: item._count.entregas,
		}));
	}

	async criar(dados) {
		try {
			return await prisma.motorista.create({
				data: {
					nome: dados.nome,
					cpf: dados.cpf,
					placa_veiculo: dados.placaVeiculo,
				},
			});
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				// P2002: Unique constraint failed
				if (e.code === "P2002") {
					throw new MotoristaDuplicadoException(
						"Já existe um motorista com esse CPF cadastrado!",
					);
				}
			}
			throw e;
		}
	}

	async atualizar(id, dados) {
		return await prisma.motorista.update({
			where: { id },
			data: {
				nome: dados.nome,
				cpf: dados.cpf,
				placa_veiculo: dados.placaVeiculo,
				status: dados.status,
			},
		});
	}
}
