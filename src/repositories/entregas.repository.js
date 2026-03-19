export class EntregasRepository {
   constructor(database) {
      this.database = database
   }

   async listarTodos() {
      return this.database.getEntregas();
   }

   async buscarPorId(id) {
      return this.database.getEntregas().find(x => x.id === id) ?? null;
   }

   async criar(dados) {
      return this.database.getEntregas().push(dados);
   }

   async atualizar(id, dados) {
      const indice = this.database.getEntregas().findIndex((u) => u.id === id);
      if (indice === -1) return null;
      this.database.getEntregas()[indice] = { ...this.database.getEntregas()[indice], ...dados, id };
      return this.database.getEntregas()[indice];
   }

   async remover(id) {
      const indice = this.database.getEntregas().findIndex((u) => u.id === id);
      if (indice === -1) return false;
      this.database.getEntregas().splice(indice, 1);
      return true;
   }
}