import { verificarAccessToken } from "../utils/jwt.js";

export const validarTokenRequest = (req, res, next) => {
	const authHeader = req.headers["authorization"];

	if (!authHeader?.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Token de acesso não fornecido" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const payload = verificarAccessToken(token);
		req.usuario = payload;
		return next();
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			return res.status(401).json({ error: "Token expirado" });
		}
		if (err.name === "JsonWebTokenError") {
			return res.status(401).json({ error: "Token inválido" });
		}
		return next(err);
	}
};
