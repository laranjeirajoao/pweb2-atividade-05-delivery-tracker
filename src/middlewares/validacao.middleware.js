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
