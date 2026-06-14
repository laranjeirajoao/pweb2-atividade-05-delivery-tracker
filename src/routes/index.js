import { Router } from "express";
import authRouter from "./auth.routes.js";
import entregasRouter from "./entregas.routes.js";
import motoristasRouter from "./motoristas.routes.js";
import relatoriosRouter from "./relatorios.routes.js";

import {
	autorizar,
	validarTokenRequest,
} from "../middlewares/autenticar.middleware.js";
import { RoleEnum } from "../utils/RoleEnum.js";
import authRouterEjs from "./auth.ejs.routes.js";
import { authControllerEjs } from "./composicao-dependencias.js";
import entregasRouterEjs from "./entregas.ejs.routes.js";
import motoristasRouterEjs from "./motoristas.ejs.routes.js";
import painelRoutes from "./painel.routes.js";
import relatoriosRouterEjs from "./relatorios.ejs.routes.js";

const router = Router();

router.use("/api/auth", authRouter);
router.use("/api/entregas", validarTokenRequest, entregasRouter);
router.use("/api/motoristas", validarTokenRequest, motoristasRouter);
router.use(
	"/api/relatorios",
	validarTokenRequest,
	autorizar(RoleEnum.GESTOR),
	relatoriosRouter,
);

router.use("/painel/entregas", entregasRouterEjs);
router.use("/painel/motoristas", motoristasRouterEjs);
router.use("/painel/relatorios", relatoriosRouterEjs);
router.use("/painel/auth", authRouterEjs);
router.use("/painel", painelRoutes);

router.get("/login", authControllerEjs.renderizarFormLogin);
router.get("/registrar", authControllerEjs.renderizarFormRegistrar);

router.use("/", (req, res) => {
	res.redirect("/painel");
});

export default router;
