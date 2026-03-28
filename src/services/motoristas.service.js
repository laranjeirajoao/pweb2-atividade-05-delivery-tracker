import { AppError } from "../utils/AppError.js";
import { MotoristaStatus } from "../utils/MotoristaStatusEnum.js";

export class MotoristasService {
	constructor(repository) {
		this.repository = repository; // Dependência injetada
	}

	async listarTodos() {
		return this.repository.listarTodos();
	}

	async buscarPorId(id) {
		const motorista = await this.repository.buscarPorId(id);
		if (!motorista) throw new AppError("Motorista não encontrado", 404);
		return motorista;
	}

	async criar({ nome, cpf, placaVeiculo }) {
		nome = nome.trim();
		cpf = cpf.trim();
		placaVeiculo = placaVeiculo.trim();

		const jaExiste = await this.repository.buscarPorCpf(cpf);
		if (jaExiste) throw new AppError("Motorista já cadastrado", 409);

		const novoMotorista = {
			nome,
			cpf,
			placaVeiculo,
			status: MotoristaStatus.ATIVO,
		};

		return this.repository.criar(novoMotorista);
	}

	async atualizar(id, dados) {
		await this.buscarPorId(id); // Reutiliza a validação de existência
		return this.repository.atualizar(id, dados);
	}
}
