// Tentando simular algo parecido com uma interface do typescript
export class IEntregasRepository {
	constructor(name) {
		if (this.constructor == IEntregasRepository) {
			throw new Error("Class is of abstract type and can't be instantiated");
		}
		this.name = name;
	}

	async listarTodos(status) {
		throw new Error("Não implementado");
	}
	async buscarPorId(id) {
		throw new Error("Não implementado");
	}
	async criar(entrega) {
		throw new Error("Não implementado");
	}
	async atualizar(id, dados) {
		throw new Error("Não implementado");
	}
}
