import { describe, expect, it, jest } from "@jest/globals";
import bcrypt from "bcrypt";
import { AuthService } from "../../../src/services/auth.service";

describe("Testes unitários de Auth Service", () => {
	beforeEach(() => {
		jest.clearAllMocks();

		jest.spyOn(bcrypt, "compare");
		jest.spyOn(bcrypt, "hash");
	});

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
		criarUsuario: jest.fn(),
	};

	const service = new AuthService(repository);

	describe("Testes relacionados ao login", () => {
		it("Deve falhar ao tentar logar com email inexistente", async () => {
			bcrypt.compare.mockResolvedValueOnce(false);
			repository.buscarUsuarioPorEmail.mockResolvedValueOnce(null);

			const login = { email: "emailinexistente@email.com", senha: "pass" };
			await expect(service.login(login)).rejects.toMatchObject({
				message: "Credenciais inválidas",
				statusCode: 401,
			});
		});

		it("Deve falhar ao tentar logar com senha incorreta", async () => {
			bcrypt.compare.mockResolvedValueOnce(false);
			const login = { email: "user@email.com", senha: "pass_errada" };
			await expect(service.login(login)).rejects.toMatchObject({
				message: "Credenciais inválidas",
				statusCode: 401,
			});
		});

		it("Deve retornar accessToken, refreshToken e objeto usuario no login bem sucedido", async () => {
			bcrypt.compare.mockResolvedValueOnce(true);
			const res = await service.login({
				email: "user@email.com",
				senha: "pass",
			});
			expect(res).toHaveProperty("accessToken");
			expect(res).toHaveProperty("refreshToken");
			expect(res).toHaveProperty("usuario");
		});

		it("Não deve retornar senha no login bem sucedido", async () => {
			bcrypt.compare.mockResolvedValueOnce(true);
			const res = await service.login({
				email: "user@email.com",
				senha: "pass",
			});
			expect(res).not.toHaveProperty("usuario.senha");
		});
	});

	describe("Testes relacionados a criacao de usuarios", () => {
		it("Deve falhar ao tentar cadastrar um usuario com email que ja esta cadastrado", async () => {
			const obj = {
				nome: "user",
				email: "user@email.com",
				senha: "pass",
			};

			await expect(service.registrar(obj)).rejects.toMatchObject({
				message: "E-mail já cadastrado",
				statusCode: 409,
			});
		});

		it("Deve criar usuario, e voltar a senha com o hash feito", async () => {
			const obj = {
				nome: "user",
				email: "user2@email.com",
				senha: "pass",
			};

			const senhaHash =
				"$2a$12$OFuUpmqlulYOto6Ra05.9OURBFt8UFFXOkK5ek8UI.1b/FpCtIlR2";

			repository.buscarUsuarioPorEmail.mockResolvedValueOnce(null);
			bcrypt.hash.mockResolvedValueOnce(senhaHash);

			repository.criarUsuario.mockResolvedValueOnce({
				id: 2,
				nome: obj.nome,
				email: obj.email,
				senha: senhaHash,
			});

			await service.registrar(obj);

			expect(bcrypt.hash).toHaveBeenCalledWith(
				obj.senha,
				expect.any(Number),
			);

			expect(repository.criarUsuario).toHaveBeenCalledWith(
				expect.objectContaining({
					senha: senhaHash,
				}),
			);

			const ordemHash = bcrypt.hash.mock.invocationCallOrder[0];
			const ordemCriar = repository.criarUsuario.mock.invocationCallOrder[0];

			expect(ordemHash).toBeLessThan(ordemCriar);
		});
	});
});
