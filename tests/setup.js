import { prisma } from "../src/database/prisma";

beforeAll(async () => {
	process.env.NODE_ENV = "test";
});

afterAll(async () => {
	await prisma.$disconnect();
});
