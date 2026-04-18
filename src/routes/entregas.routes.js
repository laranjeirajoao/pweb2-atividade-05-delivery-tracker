import { Router } from "express";
import {
	validarCriacaoEntrega,
	validarDatasNaQuery,
} from "../middlewares/validacao.middleware.js";
import { entregasController } from "./composicao-dependencias.js";

const router = Router();

router.post("/", validarCriacaoEntrega, entregasController.criar);
router.get("/", validarDatasNaQuery, entregasController.listarTodos);
router.get("/:id", entregasController.buscarPorId);
router.patch("/:id/avancar", entregasController.avancarStatus);
router.patch("/:id/cancelar", entregasController.cancelarEntrega);
router.get("/:id/historico", entregasController.buscarHistoricoPorId);
router.patch("/:id/atribuir", entregasController.atribuirMotorista);

export default router;
