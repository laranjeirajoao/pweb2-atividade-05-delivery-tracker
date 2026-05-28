import { Router } from "express";
import { autenticar } from "../middlewares/autenticar.middleware.js";
import { validarCriacaoMotorista } from "../middlewares/validacao.middleware.js";
import { RoleEnum } from "../utils/RoleEnum.js";
import { motoristasController } from "./composicao-dependencias.js";

const router = Router();

router.post(
	"/",
	autenticar(RoleEnum.GESTOR),
	validarCriacaoMotorista,
	motoristasController.criar,
);
router.get("/", motoristasController.listarTodos);
router.get("/:id", motoristasController.buscarPorId);
router.get("/:id/entregas", motoristasController.buscarEntregas);

export default router;
