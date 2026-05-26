// src/utils/jwt.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export function gerarAccessToken(payload) {
	return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function gerarRefreshToken(payload) {
	return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verificarAccessToken(token) {
	return jwt.verify(token, SECRET); // lança erro se inválido ou expirado
}

export function verificarRefreshToken(token) {
	return jwt.verify(token, REFRESH_SECRET);
}
