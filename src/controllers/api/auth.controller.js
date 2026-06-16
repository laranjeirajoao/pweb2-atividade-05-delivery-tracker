//
export class AuthController {
	constructor(service) {
		this.service = service;

		// Binding necessário para preservar o contexto de `this` nos handlers
		this.registrar = this.registrar.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}

	async registrar(req, res, next) {
		try {
			const { nome, email, senha } = req.body;
			const usuario = await this.service.registrar({
				nome,
				email,
				senha,
			});
			res.status(201).json(usuario);
		} catch (err) {
			next(err);
		}
	}

	async login(req, res, next) {
		try {
			const { email, senha } = req.body;
			const { accessToken, refreshToken, usuario } =
				await this.service.login({ email, senha });
			res.json({ usuario, accessToken, refreshToken });
		} catch (err) {
			next(err);
		}
	}

	async logout(req, res, next) {
		try {
			const { refreshToken } = req.body;
			await this.service.logout(refreshToken);
			res.json({ message: "Logout realizado com sucesso" });
		} catch (err) {
			next(err);
		}
	}
}
