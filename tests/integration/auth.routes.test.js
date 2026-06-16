// tests/integration/usuarios.routes.test.js
import { beforeEach, describe, expect, it } from "@jest/globals";
import { randomUUID } from "node:crypto";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/database/prisma.js";

beforeEach(async () => {
	await prisma.refreshToken.deleteMany();
	await prisma.usuario.deleteMany();
});

describe("POST /api/auth/registrar", () => {
	it("deve retornar 201 quando os dados sao validos", async () => {
		const email = `teste_${randomUUID()}@ex.com`;
		const resposta = await request(app)
			.post("/api/auth/registrar")
			.send({ nome: "Usuário Teste", email, senha: "senha12345" });

		expect(resposta.status).toBe(201);
		expect(resposta.body).not.toHaveProperty("senha");
	});

	it("deve retornar 400 quando senha for menor que 6 caracteres", async () => {
		const email = `teste_${randomUUID()}@ex.com`;
		const resposta = await request(app)
			.post("/api/auth/registrar")
			.send({ nome: "Usuário Teste", email, senha: "senha" });

		expect(resposta.status).toBe(400);
	});

	it("deve retornar 409 quando o e-mail já está cadastrado", async () => {
		const dados = {
			nome: "Duplicado",
			email: "dup@ex.com",
			senha: "senha12345",
		};

		// cadastra o usuario de teste
		await request(app).post("/api/auth/registrar").send(dados);

		// tenta cadastrar ele novamente
		const resposta = await request(app)
			.post("/api/auth/registrar")
			.send(dados);

		expect(resposta.status).toBe(409);
	});
});

describe("POST /api/auth/login", () => {
	it("deve retornar 200 com accessToken e refreshToken", async () => {
		const email = `teste_${randomUUID()}@ex.com`;
		await request(app)
			.post("/api/auth/registrar")
			.send({ nome: "Usuário Teste", email, senha: "senha12345" });

		const resposta = await request(app)
			.post("/api/auth/login")
			.send({ email, senha: "senha12345" });

		expect(resposta.status).toBe(200);
		expect(resposta.body).toHaveProperty("accessToken");
		expect(resposta.body).toHaveProperty("refreshToken");
	});

	it("deve retornar 401 quando credenciais invalidas (senha incorreta)", async () => {
		const email = `teste_${randomUUID()}@ex.com`;
		await request(app)
			.post("/api/auth/registrar")
			.send({ nome: "Usuário Teste", email, senha: "senha12345" });

		const resposta = await request(app)
			.post("/api/auth/login")
			.send({ email, senha: "senhaerrada" });

		expect(resposta.status).toBe(401);
		expect(resposta.body).toHaveProperty("erro", "Credenciais inválidas");
	});

	it("deve retornar 401 quando credenciais invalidas (email inexistente)", async () => {
		const email = `teste_${randomUUID()}@ex.com`;

		const resposta = await request(app)
			.post("/api/auth/login")
			.send({ email, senha: "senhaerrada" });

		expect(resposta.status).toBe(401);
		expect(resposta.body).toHaveProperty("erro", "Credenciais inválidas");
	});
});
