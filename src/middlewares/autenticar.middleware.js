import { verificarAccessToken } from "../utils/jwt.js";

export const autorizar =
	(...papeis) =>
	(req, res, next) => {
		if (!req.usuario)
			return res.status(401).json({ erro: "Não autenticado" });

		if (papeis.length > 0 && !papeis.includes(req.usuario.papel)) {
			return res.status(403).json({ erro: "Acesso negado" });
		}

		return next();
	};

export const autenticar = autorizar;

export const validarTokenRequest = (req, res, next) => {
	const authHeader = req.headers["authorization"];

	if (!authHeader?.startsWith("Bearer ")) {
		return res.status(401).json({ erro: "Token de acesso não fornecido" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const payload = verificarAccessToken(token);
		req.usuario = payload;
		return next();
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			return res.status(401).json({ erro: "Token expirado" });
		}
		if (err.name === "JsonWebTokenError") {
			return res.status(401).json({ erro: "Token inválido" });
		}
		return next(err);
	}
};

export const validarTokenRequestEjs = (req, res, next) => {
	const authHeader = req.headers["authorization"];

	if (!authHeader?.startsWith("Bearer ")) {
		req.session.erros = ["Token de acesso não fornecido"];
		return res.redirect("/painel/auth/login");
	}

	const token = authHeader.split(" ")[1];

	try {
		const payload = verificarAccessToken(token);
		req.usuario = payload;
		return next();
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			req.session.erros = ["Token expirado"];
			return res.redirect("/painel/auth/login");
		}
		if (err.name === "JsonWebTokenError") {
			req.session.erros = ["Token inválido"];
			return res.redirect("/painel/auth/login");
		}
		return next(err);
	}
};
