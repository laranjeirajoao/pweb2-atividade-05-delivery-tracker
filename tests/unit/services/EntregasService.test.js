import { describe, expect, it, jest } from "@jest/globals";
import { EntregasService } from "../../../src/services/entregas.service.js";

describe("EntregasService", () => {
	describe("Criação de entregas", () => {
		const retornoEsperadoRepository = {
			data: [],
			total: 1,
			page: 0,
			limit: 10,
			totalPages: 1,
		};
		const repository = {
			listarTodos: jest.fn().mockResolvedValue(retornoEsperadoRepository),
		};
		const service = new EntregasService(repository);

		it("deve retornar 409 ao tentar criar entrega origem e destino iguais", async () => {
			const obj = {
				destino: "maceio",
				origem: "maceio",
				criadorId: null,
				descricao: "",
			};
			await expect(service.criar(obj)).rejects.toMatchObject({
				message: "Origem e Destino não podem ser iguais!",
				statusCode: 409,
			});
		});

		it("deve retornar 409 ao tentar criar entrega ja existente", async () => {
			const obj = {
				destino: "maceio",
				origem: "sao miguel",
				criadorId: null,
				descricao: "",
			};
			await expect(service.criar(obj)).rejects.toMatchObject({
				message: "Entrega já cadastrada",
				statusCode: 409,
			});
		});
	});

	describe("Transição de status", () => {
		const entregaCriada = {
			id: 1,
			descricao: "",
			origem: "sao miguel",
			destino: "maceio",
			historico: [],
			status: "CRIADA",
			motoristaId: null,
		};

		const entregaEmTransito = {
			id: 1,
			descricao: "",
			origem: "sao miguel",
			destino: "maceio",
			historico: [],
			status: "EM_TRANSITO",
			motoristaId: null,
		};

		const entregaEntregue = {
			id: 1,
			descricao: "",
			origem: "sao miguel",
			destino: "maceio",
			historico: [],
			status: "ENTREGUE",
			motoristaId: null,
		};

		const entregaCancelada = {
			id: 1,
			descricao: "",
			origem: "sao miguel",
			destino: "maceio",
			historico: [],
			status: "CANCELADA",
			motoristaId: null,
		};

		it("Deve avançar estado de CRIADA pra EM_TRANSITO", async () => {
			const repository = {
				buscarPorId: jest.fn().mockResolvedValue(entregaCriada),
				atualizar: jest.fn().mockResolvedValue(entregaEmTransito),
			};
			const service = new EntregasService(repository);

			await expect(service.avancarStatus(1)).resolves.toHaveProperty(
				"status",
				"EM_TRANSITO",
			);
		});

		it("Deve avançar estado de EM_TRANSITO pra ENTREGUE", async () => {
			const repository = {
				buscarPorId: jest.fn().mockResolvedValue(entregaEmTransito),
				atualizar: jest.fn().mockResolvedValue(entregaEntregue),
			};
			const service = new EntregasService(repository);
			await expect(service.avancarStatus(1)).resolves.toHaveProperty(
				"status",
				"ENTREGUE",
			);
		});

		it("Deve falhar ao tentar avancar estado ENTREGUE", async () => {
			const repository = {
				buscarPorId: jest.fn().mockResolvedValue(entregaEntregue),
				atualizar: jest.fn().mockResolvedValue(entregaEntregue),
			};
			const service = new EntregasService(repository);
			await expect(service.avancarStatus(1)).rejects.toMatchObject({
				message: "Entrega já finalizada. Status atual: ENTREGUE",
				statusCode: 409,
			});
		});

		it("Deve falhar ao tentar cancelar entrega com status ENTREGUE", async () => {
			const repository = {
				buscarPorId: jest.fn().mockResolvedValue(entregaEntregue),
				atualizar: jest.fn().mockResolvedValue(entregaCancelada),
			};
			const service = new EntregasService(repository);
			await expect(service.cancelarEntrega(1)).rejects.toMatchObject({
				message: "Entrega já finalizada. Status atual: ENTREGUE",
				statusCode: 409,
			});
		});
	});
});
