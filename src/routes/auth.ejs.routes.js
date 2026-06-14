import { Router } from "express";
import { authControllerEjs as authController } from "./composicao-dependencias.js";

const router = Router();

router.get("/login", authController.renderizarFormLogin);
router.get("/registrar", authController.renderizarFormRegistrar);

export default router;
