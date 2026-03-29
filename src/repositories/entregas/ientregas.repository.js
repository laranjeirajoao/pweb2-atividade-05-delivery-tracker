// Tentando simular algo parecido com uma interface do typescript
/**
 * @import { Entrega } from '../../database/database.js'
 */

/**
 * Contrato base para o repositorio de Entregas
 */
export class IEntregasRepository {
	constructor() {
		if (this.constructor == IEntregasRepository) {
			throw new Error("Class is of abstract type and can't be instantiated");
		}
	}

	/**
	 * Função que busca e retorna um array com todas as entregas
	 * @abstract
	 * @param {any} filtros - Opcoes de filtros que podem ser passados
	 * @returns {Promise<Entrega[]>}
	 */
	async listarTodos(filtros) {
		throw new Error("Não implementado");
	}

	/**
	 * Função que recebe um id busca um objeto de id correspondente
	 * @abstract
	 * @param {number} id - ID da entrega
	 * @returns {Promise<Entrega>}
	 */
	async buscarPorId(id) {
		throw new Error("Não implementado");
	}

	/**
	 * Função que recebe dados de entregas e persiste-os no banco
	 * @abstract
	 * @param {Entrega} dados - Valores que devem ser persistidos no banco
	 * @returns {Promise<Entrega>}
	 */
	async criar(dados) {
		throw new Error("Não implementado");
	}

	/**
	 * Função que recebe um id e dados
	 * @abstract
	 * @param {number} id - ID do objeto a ser atualizado
	 * @param {Entrega} dados - Valores atualizados do objeto
	 * @returns {Promise<Entrega>}
	 */
	async atualizar(id, dados) {
		throw new Error("Não implementado");
	}
}
