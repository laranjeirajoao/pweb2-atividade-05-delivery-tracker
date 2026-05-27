import { Router } from "express";
import {
	regrasUsuario,
	verificarValidacaoApi,
} from "../middlewares/validacao.middleware.js";
import { authController } from "./composicao-dependencias.js";

const router = Router();

router.post(
	"/registrar",
	regrasUsuario,
	verificarValidacaoApi(),
	authController.registrar,
);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;
