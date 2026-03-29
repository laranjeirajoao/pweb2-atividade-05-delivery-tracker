// Tentando simular algo parecido com uma interface do typescript

/**
 * @import { Motorista } from '../../database/database.js'
 */

/**
 * Contrato base para o repositorio de Motoristas
 */
export class IMotoristasRepository {
	constructor() {
		if (this.constructor == IMotoristasRepository) {
			throw new Error("Class is of abstract type and can't be instantiated");
		}
	}

	/**
	 * Função que busca e retorna um array com todos os motoristas
	 * @abstract
	 * @returns {Promise<Motorista[]>}
	 */
	async listarTodos() {
		throw new Error("Não implementado");
	}

	/**
	 * Função que recebe um id e busca um objeto de id correspondente
	 * @abstract
	 * @param {number} id - ID do motorista
	 * @returns {Promise<Motorista>}
	 */
	async buscarPorId(id) {
		throw new Error("Não implementado");
	}

	/**
	 * Função que recebe um CPF e busca um objeto de correspondente
	 * @abstract
	 * @param {string} cpf - CPF do motorista
	 * @returns {Promise<Motorista>}
	 */
	async buscarPorCPF(cpf) {
		throw new Error("Não implementado");
	}

	/**
	 * Função que recebe dados de motoristas e persiste-os no banco
	 * @abstract
	 * @param {Motorista} dados - Valores que devem ser persistidos no banco
	 * @returns {Promise<Motorista>}
	 */
	async criar(dados) {
		throw new Error("Não implementado");
	}

	/**
	 * Função que recebe um id e dados
	 * @abstract
	 * @param {number} id - ID do objeto a ser atualizado
	 * @param {Motorista} dados - Valores atualizados do objeto
	 * @returns {Promise<Motorista>}
	 */
	async atualizar(id, dados) {
		throw new Error("Não implementado");
	}
}
