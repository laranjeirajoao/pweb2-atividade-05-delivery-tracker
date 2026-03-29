/**
 * @typedef {Object} Motorista
 * @property {number} id
 * @property {string} nome
 * @property {string} cpf
 * @property {string} placaVeiculo
 */

/**
 * @typedef {Object} HistoricoEntrega
 * @property {Date} data
 * @property {string} descricao
 */

/**
 * @typedef {Object} Entrega
 * @property {number} id
 * @property {string} descricao
 * @property {string} origem
 * @property {string} destino
 * @property {HistoricoEntrega[]} historico
 * @property {'CRIADA' | 'EM_TRANSITO' | 'ENTREGUE' | 'CANCELADA'} status
 * @property {number | null} motoristaId
 */

/** Database em memoria de Entregas e Motoristas*/
export class Database {
	/**
	 * Instancia um database em momoria, iniciando com listas vazias
	 */
	constructor() {
		/** @type {Entrega[]} Lista de entregas cadastradas. */
		this.entregas = [];

		/** @type {Motorista[]} Lista de motoristas cadastrados. */
		this.motoristas = [];

		/** @type {number} Contador interno para geração de IDs únicos. */
		this.nextId = 1;
	}

	/**
	 * Retorna todas as entregas cadastradas.
	 * @returns {Entrega[]} Lista de entregas.
	 */
	getEntregas() {
		return this.entregas;
	}

	/**
	 * Retorna todos os motoristas cadastrados.
	 * @returns {Motorista[]} Lista de motoristas.
	 */
	getMotoristas() {
		return this.motoristas;
	}

	/**
	 * Gera e retorna um ID único auto-incrementado.
	 * @returns {number} O próximo ID disponível.
	 */
	generateId() {
		return this.nextId++;
	}
}
