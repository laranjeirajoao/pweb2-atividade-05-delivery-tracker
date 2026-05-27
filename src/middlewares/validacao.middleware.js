// src/middlewares/validacao.middleware.js
import { body, validationResult } from "express-validator";

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

export const validarDatasNaQuery = (req, res, next) => {
	const { createdDe, createdAte } = req.query;

	const isoRegex =
		/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;

	if (createdDe && !isoRegex.test(createdDe)) {
		return res.status(400).json({ erro: "createdDe inválido!" });
	}

	if (createdAte && !isoRegex.test(createdAte)) {
		return res.status(400).json({ erro: "createdAte inválido!" });
	}

	next();
};

export const regrasUsuario = [
	body("nome")
		.trim()
		.notEmpty()
		.withMessage("Nome é obrigatório")
		.isLength({ min: 2 })
		.withMessage("O nome deve ter ao menos 2 caracteres"),

	body("email")
		.trim()
		.notEmpty()
		.withMessage("E-mail é obrigatório")
		.isEmail()
		.withMessage("E-mail inválido"),
	body("senha")
		.trim()
		.notEmpty()
		.withMessage("Senha é obrigatória")
		.isLength({ min: 6 })
		.withMessage("A senha deve ter ao menos 6 caracteres"),
];

export const verificarValidacaoApi = () => (req, res, next) => {
	const erros = validationResult(req);

	if (!erros.isEmpty()) {
		const mensagens = erros.array().map((e) => e.msg);
		return res.status(400).json({ erros: mensagens });
	}

	next();
};
