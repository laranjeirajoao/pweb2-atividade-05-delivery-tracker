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
	}

	async listarTodos(req, res, next) {
		try {
			const { status, page, limit } = req.query;
			const entregas = await this.service.listarTodos({
				status,
				page,
				limit,
			});
			res.json(entregas);
		} catch (err) {
			next(err);
		}
	}

	async listarEntregasPorStatusAgrupados(req, res, next) {
		try {
			const entregas = await this.service.listarEntregasPorStatusAgrupados();
			res.json(entregas);
		} catch (err) {
			next(err);
		}
	}

	async buscarPorId(req, res, next) {
		try {
			const entrega = await this.service.buscarPorId(Number(req.params.id));
			res.json(entrega);
		} catch (err) {
			next(err);
		}
	}

	async criar(req, res, next) {
		try {
			const novaEntrega = await this.service.criar(req.body);
			res.status(201).json(novaEntrega);
		} catch (err) {
			next(err);
		}
	}

	async avancarStatus(req, res, next) {
		try {
			const atualizado = await this.service.avancarStatus(
				Number(req.params.id),
			);
			res.json(atualizado);
		} catch (err) {
			next(err);
		}
	}

	async cancelarEntrega(req, res, next) {
		try {
			const atualizado = await this.service.cancelarEntrega(
				Number(req.params.id),
			);
			res.json(atualizado);
		} catch (err) {
			next(err);
		}
	}

	async buscarHistoricoPorId(req, res, next) {
		try {
			const historico = await this.service.buscarHistoricoPorId(
				Number(req.params.id),
			);
			res.json(historico);
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
			res.json(historico);
		} catch (err) {
			next(err);
		}
	}
}
