// src/middlewares/validacao.middleware.js
export const validarCriacaoEntrega = (req, res, next) => {
	const { descricao, origem, destino } = req.body;

	if (
		!descricao ||
		typeof descricao !== "string" ||
		descricao.trim().length < 2
	) {
		return res.status(400).json({ erro: "Descrição inválida!" });
	}

	if (!origem || typeof origem !== "string" || origem.trim().length < 2) {
		return res.status(400).json({ erro: "Origem inválida!" });
	}

	if (!destino || typeof destino !== "string" || destino.trim().length < 2) {
		return res.status(400).json({ erro: "Destino inválido!" });
	}

	next();
};

export const validarCriacaoMotorista = (req, res, next) => {
	const { nome, cpf, placaVeiculo } = req.body;

	if (!nome || typeof nome !== "string" || nome.trim().length < 2) {
		return res.status(400).json({ erro: "Nome de motorista inválido!" });
	}

	if (!cpf || typeof cpf !== "string" || cpf.trim().length !== 11) {
		return res.status(400).json({
			erro: "CPF inválido! Quantidade de caracteres esperados: 11",
		});
	}

	if (
		!placaVeiculo ||
		typeof placaVeiculo !== "string" ||
		placaVeiculo.trim().length < 2
	) {
		return res.status(400).json({ erro: "Placa de Veiculo inválida!" });
	}

	next();
};
