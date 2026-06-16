// tests/integration/usuarios.routes.test.js
import { beforeEach, describe, expect, it } from "@jest/globals";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/database/prisma.js";

function gerarEmailTeste() {
	return `teste_${randomUUID()}@ex.com`;
}

// Função auxiliar para obter um token de autenticação nos testes
async function obterToken(papel = "OPERADOR") {
	const email = gerarEmailTeste();
	const respostaRegistro = await request(app)
		.post("/api/auth/registrar")
		.send({ nome: "Usuário Teste", email, senha: "senha12345" });
	expect(respostaRegistro.status).toBe(201);

	if (papel === "GESTOR") {
		await prisma.usuario.update({
			where: { email },
			data: { papel: "GESTOR" },
		});
	}

	const resposta = await request(app)
		.post("/api/auth/login")
		.send({ email, senha: "senha12345" });
	expect(resposta.status).toBe(200);

	return resposta.body.accessToken;
}

async function obterTokenExpirado(papel = "OPERADOR") {
	const email = gerarEmailTeste();
	const resposta = await request(app)
		.post("/api/auth/registrar")
		.send({ nome: "Usuário Teste", email, senha: "senha12345" });
	expect(resposta.status).toBe(201);

	if (papel === "GESTOR") {
		await prisma.usuario.update({
			where: { email },
			data: { papel: "GESTOR" },
		});
	}

	const usuario = resposta.body;

	const tokenExpirado = jwt.sign(
		{ sub: usuario.id, papel },
		process.env.JWT_SECRET,
		{ expiresIn: -1 }, // expira imediatamente
	);

	return tokenExpirado;
}

beforeEach(async () => {
	await prisma.refreshToken.deleteMany();
	await prisma.usuario.deleteMany();
});

describe("Teste de roles nas rotas", () => {
	it("deve retornar 401 quando faz uma requisicao sem token", async () => {
		const resposta = await request(app).get("/api/entregas");

		expect(resposta.status).toBe(401);
		expect(resposta.body).toHaveProperty(
			"erro",
			"Token de acesso não fornecido",
		);
	});

	it("deve retornar 401 quando token tiver assinatura invalida", async () => {
		const resposta = await request(app)
			.get("/api/entregas")
			.set("Authorization", "Bearer token.invalido.fake");

		expect(resposta.status).toBe(401);
		expect(resposta.body).toHaveProperty("erro", "Token inválido");
	});

	it("deve retornar 401 quando token estiver expirado", async () => {
		const tokenExpirado = await obterTokenExpirado();
		const resposta = await request(app)
			.get("/api/entregas")
			.set("Authorization", `Bearer ${tokenExpirado}`);

		expect(resposta.status).toBe(401);
		expect(resposta.body).toHaveProperty("erro", "Token expirado");
	});

	it("deve retornar 403 quando usuario OPERADOR acessar rota de GESTOR", async () => {
		const token = await obterToken();
		const resposta = await request(app)
			.get("/api/relatorios/entregas-por-status")
			.set("Authorization", `Bearer ${token}`);

		expect(resposta.status).toBe(403);
	});

	it("deve retornar 403 quando usuario OPERADOR tenta cancelar entrega", async () => {
		const token = await obterToken();
		const resposta = await request(app)
			.patch("/api/entregas/1/cancelar")
			.set("Authorization", `Bearer ${token}`);

		expect(resposta.status).toBe(403);
	});

	it("deve retornar 200 quando usuario GESTOR acessar rota de GESTOR", async () => {
		const token = await obterToken("GESTOR");
		const resposta = await request(app)
			.get("/api/relatorios/entregas-por-status")
			.set("Authorization", `Bearer ${token}`);

		expect(resposta.status).toBe(200);
	});
});
