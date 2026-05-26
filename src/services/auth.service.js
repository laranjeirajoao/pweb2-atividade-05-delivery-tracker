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

		const senhaHash = await bcrypt.hash(senha, CUSTO_BCRYPT);
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
		// Busca com senha para comparação
		const usuario = await this.repository.buscarUsuarioPorEmail(email);

		// Mensagem genérica — não revela se o e-mail existe ou não
		if (!usuario) throw new AppError("Credenciais inválidas", 401);

		const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
		if (!senhaCorreta) throw new AppError("Credenciais inválidas", 401);

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

		const { senha: _, ...usuarioSemSenha } = usuario;
		return { accessToken, refreshToken, usuario: usuarioSemSenha };
	}

	async logout(refreshToken) {
		await this.repository.revogarRefreshToken(refreshToken);
	}
}
