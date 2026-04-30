import { Router } from "express";
import entregasRouter from "./entregas.routes.js";
import motoristasRouter from "./motoristas.routes.js";
import relatoriosRouter from "./relatorios.routes.js";

import entregasRouterEjs from "./entregas.ejs.routes.js";
import motoristasRouterEjs from "./motoristas.ejs.routes.js";
import painelRoutes from "./painel.routes.js";
import relatoriosRouterEjs from "./relatorios.ejs.routes.js";

const router = Router();

router.use("/api/entregas", entregasRouter);
router.use("/api/motoristas", motoristasRouter);
router.use("/api/relatorios", relatoriosRouter);

router.use("/painel/entregas", entregasRouterEjs);
router.use("/painel/motoristas", motoristasRouterEjs);
router.use("/painel/relatorios", relatoriosRouterEjs);
router.use("/painel", painelRoutes);

router.use("/", (req, res) => {
	res.redirect("/painel");
});

export default router;
