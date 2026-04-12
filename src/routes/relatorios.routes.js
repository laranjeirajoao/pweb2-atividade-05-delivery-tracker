import { Router } from "express";
import { entregasController } from "./composicao-dependencias.js";

const router = Router();

router.get(
	"/entregas-por-status",
	entregasController.listarEntregasPorStatusAgrupados,
);

export default router;
