import { Router } from "express";
import { validarCriacaoMotorista } from "../middlewares/validacao.middleware.js";
import { motoristasController } from "./composicao-dependencias.js";

const router = Router();

router.post("/", validarCriacaoMotorista, motoristasController.criar);
router.get("/", motoristasController.listarTodos);
router.get("/:id", motoristasController.buscarPorId);
// router.get("/:id/entregas", motoristasController.buscarPorId)

export default router;
