import { describe, expect, it, jest } from "@jest/globals";
import { AuthService } from "../../../src/services/auth.service";

describe("Testes unitários de Auth Service", () => {
	describe("Testes relacionados ao login", () => {
		const usuarioMock = {
			id: 1,
			nome: "user",
			email: "user@email.com",
			papel: "OPERADOR",
			// hash para a senha 'pass'
			senha: "$2a$12$OFuUpmqlulYOto6Ra05.9OURBFt8UFFXOkK5ek8UI.1b/FpCtIlR2",
		};

		const repository = {
			buscarUsuarioPorEmail: jest.fn().mockResolvedValue(usuarioMock),
			salvarRefreshToken: jest.fn(),
		};

		const service = new AuthService(repository);

		it("Deve falhar ao tentar logar com email inexistente", async () => {
			repository.buscarUsuarioPorEmail.mockResolvedValueOnce(null);

			const login = { email: "emailinexistente@email.com", senha: "pass" };
			await expect(service.login(login)).rejects.toMatchObject({
				message: "Credenciais inválidas",
				statusCode: 401,
			});
		});

		it("Deve falhar ao tentar logar com senha incorreta", async () => {
			const login = { email: "user@email.com", senha: "pass_errada" };
			await expect(service.login(login)).rejects.toMatchObject({
				message: "Credenciais inválidas",
				statusCode: 401,
			});
		});

		it("Deve retornar accessToken, refreshToken e objeto usuario no login bem sucedido", async () => {
			const res = await service.login({
				email: "user@email.com",
				senha: "pass",
			});
			expect(res).toHaveProperty("accessToken");
			expect(res).toHaveProperty("refreshToken");
			expect(res).toHaveProperty("usuario");
		});

		it("Não deve retornar senha no login bem sucedido", async () => {
			const res = await service.login({
				email: "user@email.com",
				senha: "pass",
			});
			expect(res).not.toHaveProperty("usuario.senha");
		});
	});
});
