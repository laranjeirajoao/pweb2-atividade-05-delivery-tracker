import { AppError } from "../utils/AppError.js";
import { EntregaStatus } from "../utils/EntregaStatusEnum.js";
import { MotoristaStatus } from "../utils/MotoristaStatusEnum.js";

export class EntregasService {
	constructor(repository, motoristasRepository) {
		this.repository = repository; // Dependência injetada
		this.motoristasRepository = motoristasRepository;
	}

	async listarTodos(status) {
		return this.repository.listarTodos({ status });
	}

	async buscarPorId(id) {
		const entrega = await this.repository.buscarPorId(id);
		if (!entrega) throw new AppError("Entrega não encontrada", 404);
		return entrega;
	}

	async criar({ descricao, origem, destino }) {
		origem = origem.trim();
		descricao = descricao.trim();
		destino = destino.trim();

		if (origem.toLowerCase() === destino.toLowerCase()) {
			throw new AppError("Origem e Destino não podem ser iguais!", 409);
		}

		const jaExiste = await this.repository.listarTodos({
			descricao,
			origem,
			destino,
			status: [EntregaStatus.CRIADA, EntregaStatus.EM_TRANSITO],
		});
		if (jaExiste.length > 0) throw new AppError("Entrega já cadastrada", 409);

		const novaEntrega = {
			descricao,
			origem,
			destino,
			status: EntregaStatus.CRIADA,
			historico: [this._criarHistorio("CRIAÇÃO")],
		};

		return this.repository.criar(novaEntrega);
	}

	async atualizar(id, dados) {
		await this.buscarPorId(id); // Reutiliza a validação de existência
		return this.repository.atualizar(id, dados);
	}

	async buscarHistoricoPorId(id) {
		const entrega = await this.repository.buscarPorId(id);
		if (!entrega) throw new AppError("Entrega não encontrada", 404);
		return entrega.historico;
	}

	async avancarStatus(id) {
		const obj = await this.buscarPorId(id);
		if (
			obj.status === EntregaStatus.ENTREGUE ||
			obj.status === EntregaStatus.CANCELADA
		) {
			throw new AppError(
				`Entrega já finalizada. Status atual: ${obj.status}`,
				409,
			);
		}
		let novoStatus = "";
		switch (obj.status) {
			case EntregaStatus.CRIADA:
				novoStatus = EntregaStatus.EM_TRANSITO;
				break;
			case EntregaStatus.EM_TRANSITO:
				novoStatus = EntregaStatus.ENTREGUE;
				break;
			default:
				throw new AppError(
					`Entrega já finalizada. Status atual: ${obj.status}`,
					409,
				);
		}
		const updated = this._atualizarStatus(obj, novoStatus);
		return await this.atualizar(id, updated);
	}

	async cancelarEntrega(id) {
		const obj = await this.buscarPorId(id);
		if (
			obj.status === EntregaStatus.ENTREGUE ||
			obj.status === EntregaStatus.CANCELADA
		) {
			throw new AppError(
				`Entrega já finalizada. Status atual: ${obj.status}`,
				409,
			);
		}
		const updated = this._atualizarStatus(obj, EntregaStatus.CANCELADA);
		return await this.atualizar(id, updated);
	}

	async atribuirMotorista(entregaId, motoristaId) {
		const obj = await this.buscarPorId(entregaId);

		const motorista =
			await this.motoristasRepository.buscarPorId(motoristaId);
		if (!motorista) throw new AppError("Motorista não encontrado", 404);

		if (obj.status !== EntregaStatus.CRIADA) {
			throw new AppError(
				`Apenas entregas com status CRIADA estão liberadas para alocação de motoristas! Status atual: ${obj.status}`,
				422,
			);
		}
		if (motorista.status !== MotoristaStatus.ATIVO) {
			throw new AppError("Motorista INATIVO não pode ser alocado!", 422);
		}

		if (obj.motoristaId) {
			return this.atualizar(entregaId, {
				...obj,
				motoristaId,
				historico: [
					...obj.historico,
					this._criarHistorio(
						`TROCA DE MOTORISTA: #${obj.motoristaId} -> #${motoristaId}`,
					),
				],
			});
		}

		return this.atualizar(entregaId, {
			...obj,
			motoristaId,
			historico: [
				...obj.historico,
				this._criarHistorio(
					`MOTORISTA #${motoristaId} ATRIBUIDO A ENTREGA`,
				),
			],
		});
	}

	_atualizarStatus(obj, novoStatus) {
		let status = obj.status;
		const mudacaEhValida = this._mudancaStatusEhValida(status, novoStatus);
		if (!mudacaEhValida) {
			throw new AppError(
				`Mudança de status de ${status} para ${novoStatus} não é permitida`,
				409,
			);
		}

		return {
			...obj,
			status: EntregaStatus[novoStatus],
			historico: [
				...obj.historico,
				this._criarHistorio(
					`ATUALIZAÇÃO DE STATUS: ${status} -> ${novoStatus}`,
				),
			],
		};
	}

	_mudancaStatusEhValida(origem, destino) {
		switch (origem) {
			case EntregaStatus.CRIADA:
				return [
					EntregaStatus.EM_TRANSITO,
					EntregaStatus.CANCELADA,
				].includes(destino);
			case EntregaStatus.EM_TRANSITO:
				return [EntregaStatus.ENTREGUE, EntregaStatus.CANCELADA].includes(
					destino,
				);
			case EntregaStatus.ENTREGUE:
				// Entrega não pode ter status alterado depois de ser entregue
				return false;
			case EntregaStatus.CANCELADA:
				// Entrega não pode ter status alterado depois de ser cancelada
				return false;
		}
	}

	_criarHistorio(descricao) {
		return { data: new Date().toISOString(), descricao };
	}
}
