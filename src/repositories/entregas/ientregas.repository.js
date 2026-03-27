// repositories/EntregasRepository.js
// Tentando simular algo parecido com uma interface do typescript
export class IEntregasRepository {
	constructor(name) {
		if (this.constructor == Shape) {
			throw new Error("Class is of abstract type and can't be instantiated");
		}

		if (this.getArea == undefined) {
			throw new Error("getArea method must be implemented");
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
