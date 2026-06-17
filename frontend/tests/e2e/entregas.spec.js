// frontend/tests/e2e/entregas.spec.js
import { expect, test } from "@playwright/test";
import {
	criarEntregaTeste,
	criarUsuarioTeste,
	loginApi,
	registrarUsuario,
} from "./helpers/testData.js";
import { EntregasPage } from "./pages/EntregasPage.js";
import { LoginPage } from "./pages/LoginPage.js";

test.describe("Entregas", () => {
	test.beforeEach(async ({ page, request }) => {
		const usuarioValido = criarUsuarioTeste();
		await registrarUsuario(request, usuarioValido);

		const { accessToken } = await loginApi(request, usuarioValido);
		await criarEntregaTeste(request, accessToken);

		const loginPage = new LoginPage(page);

		await loginPage.acessar();
		await loginPage.login(usuarioValido.email, usuarioValido.senha);
		await expect(page).toHaveURL(/\/painel$/);

		const entregasPage = new EntregasPage(page);
		await entregasPage.acessar();
		await expect(page).toHaveURL(/\/painel\/entregas$/);
	});

	test("Listagem de entregas: tabela é exibida com ao menos uma linha", async ({
		page,
	}) => {
		const entregasPage = new EntregasPage(page);

		await expect(entregasPage.tabelaEntregas).toBeVisible();
		await expect(entregasPage.linhasEntregas.first()).toBeVisible();

		const quantidadeLinhas = await entregasPage.linhasEntregas.count();
		expect(quantidadeLinhas).toBeGreaterThan(0);
	});

	test("Logout: redireciona para /login e impede acesso a /entregas", async ({
		page,
	}) => {
		const entregasPage = new EntregasPage(page);

		await entregasPage.clicarLogout();

		await expect(page).toHaveURL(/\/login$/);

		await page.goto("/painel/entregas");

		await expect(page).toHaveURL(/\/login$/);
	});
});
