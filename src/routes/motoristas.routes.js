import { Router } from "express";
import { MotoristasController } from "../controllers/motoristas.controller.js";
import { Database } from "../database/database.js";
import { validarCriacaoMotorista } from "../middlewares/validacao.middleware.js";
import { MotoristasRepositoryInMemory } from "../repositories/motoristas/motoristas-in-memory.repository.js";
import { MotoristasService } from "../services/motoristas.service.js";

const database = new Database();
const repository = new MotoristasRepositoryInMemory(database);
const service = new MotoristasService(repository);
const controller = new MotoristasController(service);

const router = Router();

router.post("/", validarCriacaoMotorista, controller.criar);
router.get("/", controller.listarTodos);
router.get("/:id", controller.buscarPorId);
// router.get("/:id/entregas", controller.buscarPorId); todo: discutir implementacao

export default router;
