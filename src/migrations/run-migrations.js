import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../database/postgres.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runMigrationCreateTables = async () => {
	const client = await pool.connect();
	try {
		console.log("Carregando arquivo de migration");
		const sql = fs.readFileSync(
			path.resolve(__dirname, "./migration.sql"),
			"utf-8",
		);

		console.log("Iniciando execução da migration");
		await client.query("BEGIN");
		await client.query(sql);
		await client.query("COMMIT");
		console.log("Migration executada");
	} catch (err) {
		console.log("Erro de migration, dando ROLLBACK");
		await client.query("ROLLBACK");
		throw err;
	} finally {
		client.release();
		await pool.end();
	}
};
