import { Router } from "express";

const router = Router();

router.get("/sem-permissao", (req, res) => {
	res.render("layouts/painel/sem-permissao");
});
router.get("/", (req, res) => {
	res.render("layouts/painel/index");
});

export default router;
