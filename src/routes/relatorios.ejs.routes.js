import { Router } from "express";
import {
	entregasControllerEjs as entregasController,
	motoristasControllerEjs as motoristasController,
} from "./composicao-dependencias.js";

const router = Router();

router.get(
	"/entregas-por-status",
	entregasController.listarEntregasPorStatusAgrupados,
);

router.get("/motoristas-ativos", motoristasController.listarMotoristasAtivos);

export default router;
