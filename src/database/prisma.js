import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../../prisma/generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

if (
	process.env.NODE_ENV === "test" &&
	!connectionString.toLowerCase().includes("test")
) {
	throw new Error(
		"Testes bloqueados: DATABASE_URL precisa apontar para um banco de teste.",
	);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
