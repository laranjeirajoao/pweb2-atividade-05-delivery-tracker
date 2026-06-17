import { randomUUID } from "node:crypto";

export function criarUsuarioTeste() {
	return {
		nome: "Usuario E2E",
		email: `usuario-e2e-${randomUUID()}@teste.com`,
		senha: "senha12345",
	};
}

export async function registrarUsuario(request, usuario) {
	const response = await request.post("/api/auth/registrar", { data: usuario });

	if (!response.ok()) {
		throw new Error(`Falha ao registrar usuario E2E: ${await response.text()}`);
	}
}

export async function loginApi(request, usuario) {
	const response = await request.post("/api/auth/login", {
		data: { email: usuario.email, senha: usuario.senha },
	});

	if (!response.ok()) {
		throw new Error(`Falha ao autenticar usuario E2E: ${await response.text()}`);
	}

	return await response.json();
}

export async function criarEntregaTeste(request, accessToken) {
	const id = randomUUID();
	const response = await request.post("/api/entregas", {
		headers: { Authorization: `Bearer ${accessToken}` },
		data: {
			descricao: `Entrega E2E ${id}`,
			origem: `Origem ${id}`,
			destino: `Destino ${id}`,
		},
	});

	if (!response.ok()) {
		throw new Error(`Falha ao criar entrega E2E: ${await response.text()}`);
	}
}
