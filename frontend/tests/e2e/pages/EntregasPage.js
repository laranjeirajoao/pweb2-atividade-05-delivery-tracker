// frontend/tests/e2e/pages/EntregasPage.js

export class EntregasPage {
	constructor(page) {
		this.page = page;

		this.tabelaEntregas = page.getByTestId("tabela-entregas");
		this.linhasEntregas = page.getByTestId("linha-entrega");
		this.btnLogout = page.getByTestId("btn-logout");
	}

	async acessar() {
		await this.page.goto("/painel/entregas");
	}

	async clicarLogout() {
		await this.btnLogout.click();
	}
}
