// frontend/tests/e2e/login.spec.js
import { expect, test } from "@playwright/test";
import {
	criarUsuarioTeste,
	registrarUsuario,
} from "./helpers/testData.js";
import { LoginPage } from "./pages/LoginPage.js";

test.describe("Login", () => {
	test("Login inválido: exibe erro e não redireciona", async ({ page }) => {
		const loginPage = new LoginPage(page);

		await loginPage.acessar();
		await loginPage.login("email-invalido@teste.com", "senha-incorreta");

		await expect(loginPage.alertaErro).toBeVisible();
		await expect(page).toHaveURL(/\/login$/);
	});

	test("Login válido: redireciona para /painel", async ({ page, request }) => {
		const usuarioValido = criarUsuarioTeste();
		await registrarUsuario(request, usuarioValido);

		const loginPage = new LoginPage(page);

		await loginPage.acessar();
		await loginPage.login(usuarioValido.email, usuarioValido.senha);

		await expect(page).toHaveURL(/\/painel$/);
	});

	test("Acesso sem autenticação: /painel/entregas redireciona para /login", async ({
		page,
	}) => {
		await page.goto("/painel/entregas");

		await expect(page).toHaveURL(/\/login$/);
	});
});
