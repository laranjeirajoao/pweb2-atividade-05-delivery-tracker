// src/bootstrap.js
import { EntregasController } from "../controllers/entregas.controller.js";
import { MotoristasController } from "../controllers/motoristas.controller.js";
import { Database } from "../database/database.js";
import { EntregasRepositoryInMemory } from "../repositories/entregas/entregas-in-memory.repository.js";
import { MotoristasRepositoryInMemory } from "../repositories/motoristas/motoristas-in-memory.repository.js";
import { EntregasService } from "../services/entregas.service.js";
import { MotoristasService } from "../services/motoristas.service.js";

const database = new Database();
const entregasRepo = new EntregasRepositoryInMemory(database);
const motoristasRepo = new MotoristasRepositoryInMemory(database);
const entregasService = new EntregasService(entregasRepo, motoristasRepo);
const motoristasService = new MotoristasService(motoristasRepo);
const entregasController = new EntregasController(entregasService);
const motoristasController = new MotoristasController(
	motoristasService,
	entregasService,
);

export { entregasController, motoristasController };
