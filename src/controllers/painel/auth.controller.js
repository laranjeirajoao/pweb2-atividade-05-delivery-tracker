export class AuthControllerEjs {
	constructor(service) {
		this.service = service;

		// Binding necessário para preservar o contexto de `this` nos handlers
		this.renderizarFormRegistrar = this.renderizarFormRegistrar.bind(this);
		this.renderizarFormLogin = this.renderizarFormLogin.bind(this);
	}

	async renderizarFormRegistrar(req, res, next) {
		try {
			res.render("layouts/painel/registrar", { erros: [], dados: {} });
		} catch (err) {
			next(err);
		}
	}

	async renderizarFormLogin(req, res, next) {
		try {
			res.render("layouts/painel/login", { erros: [], dados: {} });
		} catch (err) {
			next(err);
		}
	}
}
