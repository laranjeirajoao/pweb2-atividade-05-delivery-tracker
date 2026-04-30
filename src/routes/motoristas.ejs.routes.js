import { Router } from "express";
import { validarCriacaoMotorista } from "../middlewares/validacao.middleware.js";
import { motoristasControllerEjs as motoristasController } from "./composicao-dependencias.js";

const router = Router();

router.post("/", validarCriacaoMotorista, motoristasController.criar);
router.get("/", motoristasController.listarTodos);
router.get("/:id", motoristasController.buscarPorId);
router.get("/:id/entregas", motoristasController.buscarEntregas);

export default router;
