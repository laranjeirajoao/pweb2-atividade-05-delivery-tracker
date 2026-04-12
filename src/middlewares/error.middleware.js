import { MotoristaDuplicadoException } from "../exceptions/MotoristaDuplicadoException.js";
import { AppError } from "../utils/AppError.js";

export const middlewareDeErros = (err, req, res, next) => {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({ erro: err.message });
	}

	if (err instanceof MotoristaDuplicadoException) {
		return res.status(409).json({ erro: err.message });
	}

	console.error(err);
	res.status(500).json({ erro: "Erro interno do servidor" });
};
