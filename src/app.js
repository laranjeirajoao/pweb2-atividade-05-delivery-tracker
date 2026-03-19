import express from 'express';
import { middlewareDeErros } from './middlewares/errors.middleware.js';
import router from './routes/index.js';

const app = express();

app.use(helmet())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(router)

// Middleware de erro — DEVE ter 4 parâmetros
app.use(middlewareDeErros);

export default app