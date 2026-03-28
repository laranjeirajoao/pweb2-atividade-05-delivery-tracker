// Tentando simular algo parecido com uma interface do typescript
export class IMotoristasRepository {
	constructor() {
		if (this.constructor == IMotoristasRepository) {
			throw new Error("Class is of abstract type and can't be instantiated");
		}
	}

	async listarTodos(status) {
		throw new Error("Não implementado");
	}
	async buscarPorId(id) {
		throw new Error("Não implementado");
	}
	async buscarPorCPF(cpf) {
		throw new Error("Não implementado");
	}
	async criar(entrega) {
		throw new Error("Não implementado");
	}
	async atualizar(id, dados) {
		throw new Error("Não implementado");
	}
}
