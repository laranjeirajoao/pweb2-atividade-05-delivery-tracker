import dotenv from "dotenv";

dotenv.config({
	path: ".env.test",
	override: true,
	quiet: true,
});

process.env.NODE_ENV = "test";

const databaseUrl = process.env.DATABASE_URL || "";

if (!databaseUrl.toLowerCase().includes("test")) {
	throw new Error(
		"Testes bloqueados: DATABASE_URL precisa apontar para um banco de teste.",
	);
}
