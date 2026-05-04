import { Router } from "express";
import { validarCriacaoEntrega } from "../middlewares/validacao.middleware.js";
import { entregasControllerEjs as entregasController } from "./composicao-dependencias.js";

const router = Router();

router.get("/nova", entregasController.renderizarFormularioCriacao);
router.post("/", validarCriacaoEntrega, entregasController.criar);

router.get("/", entregasController.listarTodos);

router.get("/:id", entregasController.buscarPorId);
router.patch("/:id/avancar", entregasController.avancarStatus);
router.patch("/:id/cancelar", entregasController.cancelarEntrega);
router.patch("/:id/atribuir", entregasController.atribuirMotorista);

export default router;
