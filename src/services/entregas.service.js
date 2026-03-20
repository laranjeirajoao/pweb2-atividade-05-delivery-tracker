import { AppError } from "../utils/AppError.js";
import { EntregaStatus } from "../utils/EntregaStatusEnum.js";

export class EntregasService {
	constructor(repository) {
		this.repository = repository; // Dependência injetada
	}

	async listarTodos(status) {
		if (status) {
			const items = await this.repository.listarTodos();
			return items.filter((x) => x.status === status);
		}
		return this.repository.listarTodos();
	}

	async buscarPorId(id) {
		const entrega = await this.repository.buscarPorId(id);
		if (!entrega) throw new AppError("Usuário não encontrado", 404);
		return entrega;
	}

	async criar({ descricao, origem, destino }) {
		const jaExiste = await this.repository.buscarPorDescricaoOrigemEDestino({
			descricao,
			origem,
			destino,
		});
		if (jaExiste) throw new AppError("Entrega já cadastrada", 409);

		const novaEntrega = {
			descricao,
			origem,
			destino,
			status: EntregaStatus.CRIADA,
			historico: [
				{
					data: new Date().toISOString(),
					descricao: "Criação",
				},
			],
		};

		return this.repository.criar(novaEntrega);
	}

	async atualizar(id, dados) {
		await this.buscarPorId(id); // Reutiliza a validação de existência
		return this.repository.atualizar(id, dados);
	}

	async remover(id) {
		await this.buscarPorId(id); // Reutiliza a validação de existência
		return this.repository.remover(id);
	}

	async buscarHistoricoPorId(id) {
		const entrega = await this.repository.buscarPorId(id);
		if (!entrega) throw new AppError("Usuário não encontrado", 404);
		return entrega.historico;
	}
}
