//
export class EntregasController {
	constructor(service) {
		this.service = service;

		// Binding necessário para preservar o contexto de `this` nos handlers
		this.listarTodos = this.listarTodos.bind(this);
		this.listarEntregasPorStatusAgrupados =
			this.listarEntregasPorStatusAgrupados.bind(this);
		this.buscarPorId = this.buscarPorId.bind(this);
		this.criar = this.criar.bind(this);
		this.buscarHistoricoPorId = this.buscarHistoricoPorId.bind(this);
		this.avancarStatus = this.avancarStatus.bind(this);
		this.cancelarEntrega = this.cancelarEntrega.bind(this);
		this.atribuirMotorista = this.atribuirMotorista.bind(this);
		this.renderizarFormularioCriacao =
			this.renderizarFormularioCriacao.bind(this);
	}

	async listarTodos(req, res, next) {
		try {
			const { status = "", page, limit, createdDe, createdAte } = req.query;
			const entregas = await this.service.listarTodos({
				status,
				page,
				limit,
				createdDe,
				createdAte,
			});

			res.render("layouts/entregas/index", {
				data: entregas.data,
				statusSelecionado: status,
				page: entregas.page,
				limit: entregas.limit,
				totalPages: entregas.totalPages,
			});
		} catch (err) {
			next(err);
		}
	}

	async listarEntregasPorStatusAgrupados(req, res, next) {
		try {
			const entregas = await this.service.listarEntregasPorStatusAgrupados();
			// res.json(entregas);
			//todo
		} catch (err) {
			next(err);
		}
	}

	async buscarPorId(req, res, next) {
		try {
			const entrega = await this.service.buscarPorId(Number(req.params.id));
			res.render("layouts/entregas/detalhes", { data: entrega });
		} catch (err) {
			next(err);
		}
	}

	async renderizarFormularioCriacao(req, res, next) {
		try {
			res.render("layouts/entregas/nova", { erros: [], dados: {} });
		} catch (err) {
			next(err);
		}
	}

	async criar(req, res, next) {
		try {
			await this.service.criar(req.body);
			req.flash("sucesso", "Entrega criada com sucesso!");
			res.redirect("/painel/entregas");
		} catch (err) {
			req.flash("erro", "Erro ao criar entrega!");
			res.render("layouts/entregas/nova", {
				erros: (err.message && [err.message]) || [],
				dados: req.body,
			});
		}
	}

	async avancarStatus(req, res, next) {
		try {
			const id = Number(req.params.id);
			await this.service.avancarStatus(id);

			req.flash("sucesso", "Entrega avançada com sucesso!");
			res.redirect(`/painel/entregas/${id}`);
		} catch (err) {
			req.flash(
				"erro",
				"Erro ao avançar status da entrega!" +
					(err.message ? ` ${err.message}` : ""),
			);
			res.redirect(`/painel/entregas/${Number(req.params.id)}`);
		}
	}

	async cancelarEntrega(req, res, next) {
		try {
			const id = Number(req.params.id);
			await this.service.cancelarEntrega(id);

			req.flash("sucesso", "Entrega cancelada com sucesso!");
			res.redirect(`/painel/entregas/${id}`);
		} catch (err) {
			req.flash(
				"erro",
				"Erro ao cancelar entrega!" +
					(err.message ? ` ${err.message}` : ""),
			);
			res.redirect(`/painel/entregas/${Number(req.params.id)}`);
		}
	}

	async buscarHistoricoPorId(req, res, next) {
		try {
			const historico = await this.service.buscarHistoricoPorId(
				Number(req.params.id),
			);
			// res.json(historico);
			// todo
		} catch (err) {
			next(err);
		}
	}

	async atribuirMotorista(req, res, next) {
		try {
			const { motoristaId } = req.body;
			const historico = await this.service.atribuirMotorista(
				Number(req.params.id),
				Number(motoristaId),
			);
			// res.json(historico);
			// todo
		} catch (err) {
			next(err);
		}
	}
}
