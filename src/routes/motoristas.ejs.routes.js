import { Router } from "express";
import {
	regrasMotorista,
	verificarValidacao,
} from "../middlewares/validacao.ejs.middleware.js";
import { motoristasControllerEjs as motoristasController } from "./composicao-dependencias.js";

const router = Router();

router.get("/nova", motoristasController.renderizarFormularioCriacao);
router.post(
	"/",
	regrasMotorista,
	verificarValidacao("layouts/motoristas/novo"),
	motoristasController.criar,
);

router.get("/", motoristasController.listarTodos);
router.get("/:id", motoristasController.buscarPorId);
router.get("/:id/entregas", motoristasController.buscarEntregas);

export default router;
