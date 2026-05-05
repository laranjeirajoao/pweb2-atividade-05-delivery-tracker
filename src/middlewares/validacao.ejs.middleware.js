// src/middlewares/validacao.middleware.js`
import { body, query, validationResult } from "express-validator";

export const regrasEntrega = [
	body("descricao")
		.trim()
		.notEmpty()
		.withMessage("Descrição é obrigatória")
		.isLength({ min: 2 })
		.withMessage("A descrição deve ter ao menos 2 caracteres"),

	body("origem")
		.trim()
		.notEmpty()
		.withMessage("Origem é obrigatória")
		.isLength({ min: 2 })
		.withMessage("A origem deve ter ao menos 2 caracteres"),

	body("destino")
		.trim()
		.notEmpty()
		.withMessage("Destino é obrigatório")
		.isLength({ min: 2 })
		.withMessage("O destino deve ter ao menos 2 caracteres"),
];

export const regrasMotorista = [
	body("nome")
		.trim()
		.notEmpty()
		.withMessage("Nome é obrigatório")
		.isLength({ min: 2 })
		.withMessage("O nome deve ter ao menos 2 caracteres"),

	body("cpf")
		.trim()
		.notEmpty()
		.withMessage("CPF é obrigatório")
		.isLength({ min: 11, max: 11 })
		.withMessage("O CPF deve ter 11 caracteres"),

	body("placaVeiculo")
		.trim()
		.notEmpty()
		.withMessage("Placa do veículo é obrigatória")
		.isLength({ min: 2 })
		.withMessage("A placa do veículo deve ter ao menos 2 caracteres"),
];

export const regrasDatasQuery = [
	query("createdDe")
		.optional()
		.isISO8601()
		.withMessage("createdDe deve ser uma data ISO 8601 válida"),

	query("createdAte")
		.optional()
		.isISO8601()
		.withMessage("createdAte deve ser uma data ISO 8601 válida"),
];

// Middleware que verifica o resultado da validação
export const verificarValidacao = (viewName) => (req, res, next) => {
	const erros = validationResult(req);

	if (!erros.isEmpty()) {
		const mensagens = erros.array().map((e) => e.msg);
		return res.status(400).render(viewName, {
			titulo: "",
			erros: mensagens,
			dados: req.body, // repovoar o formulário
		});
	}

	next();
};
