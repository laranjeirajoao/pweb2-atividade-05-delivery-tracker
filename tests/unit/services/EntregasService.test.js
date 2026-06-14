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
});
