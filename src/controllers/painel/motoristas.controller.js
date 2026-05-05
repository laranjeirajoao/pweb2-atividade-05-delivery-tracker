//
export class MotoristasController {
	constructor(service, entregasService) {
		this.service = service;
		this.entregasService = entregasService;

		// Binding necessário para preservar o contexto de `this` nos handlers
		this.listarTodos = this.listarTodos.bind(this);
		this.buscarPorId = this.buscarPorId.bind(this);
		this.criar = this.criar.bind(this);
		this.buscarEntregas = this.buscarEntregas.bind(this);
		this.listarMotoristasAtivos = this.listarMotoristasAtivos.bind(this);
		this.renderizarFormularioCriacao =
			this.renderizarFormularioCriacao.bind(this);
	}

	async listarTodos(req, res, next) {
		try {
			const motoristas = await this.service.listarTodos();
			res.render("layouts/motoristas/index", { motoristas });
		} catch (err) {
			next(err);
		}
	}

	async buscarPorId(req, res, next) {
		try {
			const motorista = await this.service.buscarPorId(
				Number(req.params.id),
			);
			// res.json(motorista);
			// todo
		} catch (err) {
			next(err);
		}
	}

	async renderizarFormularioCriacao(req, res, next) {
		try {
			res.render("layouts/motoristas/novo", { erros: [], dados: {} });
		} catch (err) {
			next(err);
		}
	}

	async criar(req, res, next) {
		try {
			await this.service.criar({ id: null, ...req.body });
			req.flash("sucesso", "Motorista criado com sucesso!");
			res.redirect("/painel/motoristas");
		} catch (err) {
			req.flash("erro", "Erro ao criar motorista!");
			res.render("layouts/motoristas/novo", {
				erros: (err.message && [err.message]) || [],
				dados: req.body,
			});
		}
	}

	async buscarEntregas(req, res, next) {
		try {
			const { status } = req.query;
			const motoristaId = Number(req.params.id);
			const entregas = await this.entregasService.listarTodos(
				status,
				motoristaId,
			);
			// res.json(entregas);
			//todo
		} catch (err) {
			next(err);
		}
	}

	async listarMotoristasAtivos(req, res, next) {
		try {
			const entregas =
				await this.service.listarMotoristasComEntregasAtivas();
			// res.json(entregas);
			//todo
		} catch (err) {
			next(err);
		}
	}
}
