import { Router } from "express";
import entregasRouter from "./entregas.routes.js";

const router = Router();

router.use("/api/entregas", entregasRouter);

export default router;
