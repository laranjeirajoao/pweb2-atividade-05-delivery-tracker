import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { middlewareDeErros } from "./middlewares/error.middleware.js";
import router from "./routes/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "..", "public")));

app.use(router);

// Middleware de erro — DEVE ter 4 parâmetros
app.use(middlewareDeErros);

export default app;
