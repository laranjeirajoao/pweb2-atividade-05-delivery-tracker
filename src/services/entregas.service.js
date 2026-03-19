import { AppError } from '../utils/AppError.js';
import { EntregaStatus } from '../utils/EntregaStatusEnum.js';

export class EntregasService {
   constructor(repository) {
      this.repository = repository; // Dependência injetada
   }

   async listarTodos() {
      return this.repository.listarTodos();
   }

   async buscarPorId(id) {
      const usuario = await this.repository.buscarPorId(id);
      if (!usuario) throw new AppError('Usuário não encontrado', 404);
      return usuario;
   }

   async criar({ descricao, origem, destino }) {
      const jaExiste = await this.repository.buscarPorDescricaoOrigemEDestino({ descricao, origem, destino });
      if (jaExiste) throw new AppError('Entrega já cadastrada', 409);

      const novaEntrega = {
         descricao,
         origem,
         destino,
         status: EntregaStatus.CRIADA,
         historico: [{
            data: new Date().toISOString(),
            descricao: "Criação"
         }]
      }

      return this.repository.criar(novaEntrega);
   }

   async atualizar(id, dados) {
      await this.buscarPorId(id); // Reutiliza a validação de existência
      return this.repository.atualizar(id, dados);
   }

   async remover(id) {
      await this.buscarPorId(id); // Reutiliza a validação de existência
      return this.repository.remover(id);
   }
}