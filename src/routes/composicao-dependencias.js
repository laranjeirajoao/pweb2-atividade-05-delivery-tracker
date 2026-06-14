// src/bootstrap.js
import { EntregasController } from "../controllers/api/entregas.controller.js";
import { MotoristasController } from "../controllers/api/motoristas.controller.js";
import { EntregasController as EntregasControllerEjs } from "../controllers/painel/entregas.controller.js";
import { MotoristasController as MotoristasControllerEjs } from "../controllers/painel/motoristas.controller.js";
import { EntregasRepositoryPrisma as EntregasRepository } from "../repositories/entregas/entregas-prisma.repository.js";
import { MotoristasRepositoryPrisma as MotoristasRepository } from "../repositories/motoristas/motoristas-prisma.repository.js";
import { EntregasService } from "../services/entregas.service.js";
import { MotoristasService } from "../services/motoristas.service.js";

import { AuthController } from "../controllers/api/auth.controller.js";
import { AuthControllerEjs } from "../controllers/painel/auth.controller.js";
import { AuthRepositoryPrisma } from "../repositories/auth/auth.repository.js";
import { AuthService } from "../services/auth.service.js";

const entregasRepo = new EntregasRepository();
const motoristasRepo = new MotoristasRepository();
const entregasService = new EntregasService(entregasRepo, motoristasRepo);
const motoristasService = new MotoristasService(motoristasRepo);

const authRepository = new AuthRepositoryPrisma();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
const authControllerEjs = new AuthControllerEjs(authService);

const entregasController = new EntregasController(entregasService);
const motoristasController = new MotoristasController(
	motoristasService,
	entregasService,
);

const entregasControllerEjs = new EntregasControllerEjs(entregasService);
const motoristasControllerEjs = new MotoristasControllerEjs(
	motoristasService,
	entregasService,
);

export {
	authController,
	authControllerEjs,
	entregasController,
	entregasControllerEjs,
	motoristasController,
	motoristasControllerEjs,
};
