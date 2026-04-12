// src/bootstrap.js
import { EntregasController } from "../controllers/entregas.controller.js";
import { MotoristasController } from "../controllers/motoristas.controller.js";
import { EntregasRepositorySQL as EntregasRepository } from "../repositories/entregas/entregas-sql.repository.js";
import { MotoristasRepositorySQL as MotoristasRepository } from "../repositories/motoristas/motoristas-sql.repository.js";
import { EntregasService } from "../services/entregas.service.js";
import { MotoristasService } from "../services/motoristas.service.js";

const entregasRepo = new EntregasRepository();
const motoristasRepo = new MotoristasRepository();
const entregasService = new EntregasService(entregasRepo, motoristasRepo);
const motoristasService = new MotoristasService(motoristasRepo);
const entregasController = new EntregasController(entregasService);
const motoristasController = new MotoristasController(
	motoristasService,
	entregasService,
);

export { entregasController, motoristasController };
