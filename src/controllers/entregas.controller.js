//
export class EntregasController {
   constructor(service) {
      this.service = service;

      // Binding necessário para preservar o contexto de `this` nos handlers
      this.listarTodos = this.listarTodos.bind(this);
      this.buscarPorId = this.buscarPorId.bind(this);
      this.criar = this.criar.bind(this);
      this.atualizar = this.atualizar.bind(this);
      this.remover = this.remover.bind(this);
      this.buscarHistoricoPorId = this.buscarHistoricoPorId.bind(this)
   }

   async listarTodos(req, res, next) {
      try {
         const { status } = req.query
         const entregas = await this.service.listarTodos(status);
         res.json(entregas);
      } catch (err) { next(err); }
   }

   async buscarPorId(req, res, next) {
      try {
         const entrega = await this.service.buscarPorId(Number(req.params.id));
         res.json(entrega);
      } catch (err) { next(err); }
   }

   async criar(req, res, next) {
      try {
         const novaEntrega = await this.service.criar(req.body);
         res.status(201).json(novaEntrega);
      } catch (err) { next(err); }
   }

   async atualizar(req, res, next) {
      try {
         const atualizado = await this.service.atualizar(Number(req.params.id), req.body);
         res.json(atualizado);
      } catch (err) { next(err); }
   }

   async remover(req, res, next) {
      try {
         await this.service.remover(Number(req.params.id));
         res.status(204).send();
      } catch (err) { next(err); }
   }

   async buscarHistoricoPorId(req, res, next) {
      try {
         const historico = await this.service.buscarHistoricoPorId(Number(req.params.id));
         res.json(historico);
      } catch (err) { next(err); }
   }
}