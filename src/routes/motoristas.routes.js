import { Router } from "express";
import { autorizar } from "../middlewares/autenticar.middleware.js";
import { validarCriacaoMotorista } from "../middlewares/validacao.middleware.js";
import { RoleEnum } from "../utils/RoleEnum.js";
import { motoristasController } from "./composicao-dependencias.js";

const router = Router();

router.post(
	"/",
	autorizar(RoleEnum.GESTOR),
	validarCriacaoMotorista,
	motoristasController.criar,
);
router.get("/", motoristasController.listarTodos);
router.get("/:id", motoristasController.buscarPorId);
router.patch("/:id", autorizar(RoleEnum.GESTOR), motoristasController.atualizar);
router.get("/:id/entregas", motoristasController.buscarEntregas);

export default router;
