import flash from "connect-flash";
import express from "express";
import session from "express-session";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { middlewareDeErros } from "./middlewares/error.middleware.js";
import router from "./routes/index.js";

app.use(
	session({
		secret: process.env.SESSION_SECRET || "segredo-dev",
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false }, // true em produção com HTTPS
	}),
);

app.use(flash());

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

app.use((req, res, next) => {
	res.locals.flash = {
		sucesso: req.flash("sucesso"),
		erro: req.flash("erro"),
	};
	next();
});

export default app;
