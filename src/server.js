import "dotenv/config";
import app from "./app.js";
import { runMigrationCreateTables } from "./migrations/run-migrations.js";

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
	runMigrationCreateTables();
	console.log(`API iniciada na porta ${PORTA}`);
});
