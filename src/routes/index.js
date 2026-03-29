import { Router } from "express";
import entregasRouter from "./entregas.routes.js";
import motoristasRouter from "./motoristas.routes.js";

const router = Router();

router.use("/api/entregas", entregasRouter);
router.use("/api/motoristas", motoristasRouter);

export default router;
