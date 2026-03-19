import { Router } from "express";
import { EntregasController } from "../controllers/entregas.controller.js";
import { Database } from "../database/database.js";
import { EntregasRepository } from "../repositories/entregas.repository.js";
import { EntregasService } from "../services/entregas.service.js";

const database = new Database()
const repository = new EntregasRepository(database);
const service = new EntregasService(repository);
const controller = new EntregasController(service);

const router = Router()

router.get('/', controller.listarTodos);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);

export default router