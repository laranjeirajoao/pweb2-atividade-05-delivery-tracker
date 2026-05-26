// src/repositories/auth.repository.prisma.js
import { prisma } from "../../database/prisma.js";

export class AuthRepositoryPrisma {
	async buscarUsuarioPorEmail(email) {
		// Inclui a senha — usado apenas internamente para autenticação
		return prisma.usuario.findUnique({ where: { email } });
	}

	async criarUsuario(dados) {
		return prisma.usuario.create({ data: dados });
	}

	async salvarRefreshToken({ token, usuarioId, expiresAt }) {
		return prisma.refreshToken.create({
			data: { token, usuarioId, expiresAt },
		});
	}

	async buscarRefreshToken(token) {
		return prisma.refreshToken.findUnique({
			where: { token },
			include: { usuario: true },
		});
	}

	async revogarRefreshToken(token) {
		return prisma.refreshToken.deleteMany({ where: { token } });
	}

	async revogarTodosTokensDoUsuario(usuarioId) {
		return prisma.refreshToken.deleteMany({ where: { usuarioId } });
	}
}
