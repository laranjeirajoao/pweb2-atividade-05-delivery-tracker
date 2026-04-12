import { Router } from "express";
import entregasRouter from "./entregas.routes.js";
import motoristasRouter from "./motoristas.routes.js";
import relatoriosRouter from "./relatorios.routes.js";

const router = Router();

router.use("/api/entregas", entregasRouter);
router.use("/api/motoristas", motoristasRouter);
router.use("/api/relatorios", relatoriosRouter);

export default router;
