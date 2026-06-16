// tests/setup.js

import dotenv from "dotenv";
import { prisma } from "../src/database/prisma";

dotenv.config({
	path: ".env.test",
});

beforeAll(async () => {
	process.env.NODE_ENV = "test";
});

afterAll(async () => {
	await prisma.$disconnect();
});
