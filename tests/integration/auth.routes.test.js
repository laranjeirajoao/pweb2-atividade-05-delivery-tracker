// tests/integration/usuarios.routes.test.js
import { beforeEach, describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/config/database.js";

// Função auxiliar para obter um token de autenticação nos testes
async function obterToken(papel = "USER") {
	const email = `teste_${Date.now()}@ex.com`;
	await request(app)
		.post("/api/auth/register")
		.send({ nome: "Usuário Teste", email, senha: "senha12345" });

	if (papel === "ADMIN") {
		await prisma.usuario.update({
			where: { email },
			data: { papel: "ADMIN" },
		});
	}

	const resposta = await request(app)
		.post("/api/auth/login")
		.send({ email, senha: "senha12345" });

	return resposta.body.accessToken;
}

beforeEach(async () => {
	// Limpa a base entre testes — garante isolamento
	await prisma.refreshToken.deleteMany();
	await prisma.usuario.deleteMany();
});

describe("GET /api/usuarios", () => {
	it("deve retornar 401 quando nenhum token é fornecido", async () => {
		const resposta = await request(app).get("/api/usuarios");

		expect(resposta.status).toBe(401);
		expect(resposta.body).toHaveProperty("erro");
	});

	it("deve retornar 403 quando o token pertence a um usuário sem papel ADMIN", async () => {
		const token = await obterToken("USER");
		const resposta = await request(app)
			.get("/api/usuarios")
			.set("Authorization", `Bearer ${token}`);

		expect(resposta.status).toBe(403);
	});

	it("deve retornar 200 com a lista de usuários para um ADMIN autenticado", async () => {
		const token = await obterToken("ADMIN");
		const resposta = await request(app)
			.get("/api/usuarios")
			.set("Authorization", `Bearer ${token}`);

		expect(resposta.status).toBe(200);
		expect(Array.isArray(resposta.body)).toBe(true);
	});
});

describe("POST /api/usuarios", () => {
	it("deve retornar 400 quando o e-mail é inválido", async () => {
		const token = await obterToken("ADMIN");
		const resposta = await request(app)
			.post("/api/usuarios")
			.set("Authorization", `Bearer ${token}`)
			.send({ nome: "Teste", email: "email_invalido", senha: "senha12345" });

		expect(resposta.status).toBe(400);
		expect(resposta.body).toHaveProperty("erros");
	});

	it("deve retornar 201 com o usuário criado quando os dados são válidos", async () => {
		const token = await obterToken("ADMIN");
		const dados = {
			nome: "Novo Usuário",
			email: "novo@ex.com",
			senha: "senha12345",
		};
		const resposta = await request(app)
			.post("/api/usuarios")
			.set("Authorization", `Bearer ${token}`)
			.send(dados);

		expect(resposta.status).toBe(201);
		expect(resposta.body).toMatchObject({
			nome: dados.nome,
			email: dados.email,
		});
		expect(resposta.body).not.toHaveProperty("senha"); // hash nunca é exposto
	});

	it("deve retornar 409 quando o e-mail já está cadastrado", async () => {
		const token = await obterToken("ADMIN");
		const dados = {
			nome: "Duplicado",
			email: "dup@ex.com",
			senha: "senha12345",
		};

		await request(app)
			.post("/api/usuarios")
			.set("Authorization", `Bearer ${token}`)
			.send(dados);

		const resposta = await request(app)
			.post("/api/usuarios")
			.set("Authorization", `Bearer ${token}`)
			.send(dados);

		expect(resposta.status).toBe(409);
	});
});

describe("DELETE /api/usuarios/:id", () => {
	it("deve retornar 404 quando o usuário a ser excluído não existe", async () => {
		const token = await obterToken("ADMIN");
		const resposta = await request(app)
			.delete("/api/usuarios/99999")
			.set("Authorization", `Bearer ${token}`);

		expect(resposta.status).toBe(404);
	});

	it("deve retornar 204 e remover o usuário quando ele existe", async () => {
		const token = await obterToken("ADMIN");

		const criacao = await request(app)
			.post("/api/usuarios")
			.set("Authorization", `Bearer ${token}`)
			.send({
				nome: "Para Excluir",
				email: "excluir@ex.com",
				senha: "senha12345",
			});

		const resposta = await request(app)
			.delete(`/api/usuarios/${criacao.body.id}`)
			.set("Authorization", `Bearer ${token}`);

		expect(resposta.status).toBe(204);
	});
});
