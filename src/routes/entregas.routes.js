import { Router } from "express";
import { autenticar } from "../middlewares/autenticar.middleware.js";
import {
	validarCriacaoEntrega,
	validarDatasNaQuery,
} from "../middlewares/validacao.middleware.js";
import { RoleEnum } from "../utils/RoleEnum.js";
import { entregasController } from "./composicao-dependencias.js";

const router = Router();

router.post("/", validarCriacaoEntrega, entregasController.criar);
router.get("/", validarDatasNaQuery, entregasController.listarTodos);
router.get("/:id", entregasController.buscarPorId);
router.patch("/:id/avancar", entregasController.avancarStatus);
router.patch(
	"/:id/cancelar",
	autenticar(RoleEnum.GESTOR),
	entregasController.cancelarEntrega,
);
router.get("/:id/historico", entregasController.buscarHistoricoPorId);
router.patch("/:id/atribuir", entregasController.atribuirMotorista);

export default router;
