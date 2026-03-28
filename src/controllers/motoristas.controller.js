//
export class MotoristasController {
	constructor(service) {
		this.service = service;

		// Binding necessário para preservar o contexto de `this` nos handlers
		this.listarTodos = this.listarTodos.bind(this);
		this.buscarPorId = this.buscarPorId.bind(this);
		this.criar = this.criar.bind(this);
	}

	async listarTodos(req, res, next) {
		try {
			const { status } = req.query;
			const entregas = await this.service.listarTodos(status);
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
}
