import { Router } from "express";
import { EntregasController } from "../controllers/entregas.controller.js";
import { Database } from "../database/database.js";
import { validarCriacaoEntrega } from "../middlewares/validacao.middleware.js";
import { EntregasRepository } from "../repositories/entregas.repository.js";
import { EntregasService } from "../services/entregas.service.js";

const database = new Database();
const repository = new EntregasRepository(database);
const service = new EntregasService(repository);
const controller = new EntregasController(service);

const router = Router();

router.post("/", validarCriacaoEntrega, controller.criar);
router.get("/", controller.listarTodos);
router.get("/:id", controller.buscarPorId);
router.patch("/:id/avancar", controller.avancarStatus);
router.patch("/:id/cancelar", controller.cancelarEntrega);
router.get("/:id/historico", controller.buscarHistoricoPorId);

export default router;
