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
	}

	async listarTodos(req, res, next) {
		try {
			const motoristas = await this.service.listarTodos();
			res.json(motoristas);
		} catch (err) {
			next(err);
		}
	}

	async buscarPorId(req, res, next) {
		try {
			const motorista = await this.service.buscarPorId(
				Number(req.params.id),
			);
			res.json(motorista);
		} catch (err) {
			next(err);
		}
	}

	async criar(req, res, next) {
		try {
			const novoMotorista = await this.service.criar(req.body);
			res.status(201).json(novoMotorista);
		} catch (err) {
			next(err);
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
			res.json(entregas);
		} catch (err) {
			next(err);
		}
	}

	async listarMotoristasAtivos(req, res, next) {
		try {
			const entregas =
				await this.service.listarMotoristasComEntregasAtivas();
			res.json(entregas);
		} catch (err) {
			next(err);
		}
	}
}
