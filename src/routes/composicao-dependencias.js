// src/bootstrap.js
import { EntregasController } from "../controllers/entregas.controller.js";
import { MotoristasController } from "../controllers/motoristas.controller.js";
import { EntregasRepositoryPrisma as EntregasRepository } from "../repositories/entregas/entregas-prisma.repository.js";
import { MotoristasRepositoryPrisma as MotoristasRepository } from "../repositories/motoristas/motoristas-prisma.repository.js";
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
