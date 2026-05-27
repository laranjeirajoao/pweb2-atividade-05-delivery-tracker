// src/services/auth.service.js
import bcrypt from "bcrypt";
import { AppError } from "../utils/AppError.js";
import { gerarAccessToken, gerarRefreshToken } from "../utils/jwt.js";

const CUSTO_BCRYPT = 12;

export class AuthService {
	constructor(authRepository) {
		this.repository = authRepository;
	}

	async registrar({ nome, email, senha }) {
		const jaExiste = await this.repository.buscarUsuarioPorEmail(email);
		if (jaExiste) throw new AppError("E-mail já cadastrado", 409);

		const senhaHash = await this._gerarHashSenha(senha);
		const usuario = await this.repository.criarUsuario({
			nome,
			email,
			senha: senhaHash,
		});

		// Não retorna a senha no objeto de resposta
		const { senha: _, ...usuarioSemSenha } = usuario;
		return usuarioSemSenha;
	}

	async login({ email, senha }) {
		const usuario = await this.repository.buscarUsuarioPorEmail(email);
		const senhaCorreta = await this._compararSenha(senha, usuario.senha);
		if (!usuario || !senhaCorreta)
			throw new AppError("Credenciais inválidas", 401);

		const payload = {
			sub: usuario.id,
			nome: usuario.nome,
			email: usuario.email,
			papel: usuario.papel,
		};

		const accessToken = gerarAccessToken(payload);
		const refreshToken = gerarRefreshToken({ sub: usuario.id });

		// Persiste o refresh token no banco
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias
		await this.repository.salvarRefreshToken({
			token: refreshToken,
			usuarioId: usuario.id,
			expiresAt,
		});

		return { accessToken, refreshToken };
	}

	async logout(refreshToken) {
		//retorna quantas linhas afetadas
		const { count } = await this.repository.revogarRefreshToken(refreshToken);

		if (count < 1) {
			throw new AppError("Não foi possivel realizar o logout!", 400);
		}
		return { count };
	}

	async _gerarHashSenha(senha) {
		return await bcrypt.hash(senha, CUSTO_BCRYPT);
	}

	async _compararSenha(senha, hash) {
		return await bcrypt.compare(senha, hash);
	}
}
