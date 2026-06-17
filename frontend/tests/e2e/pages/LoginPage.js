// frontend/tests/e2e/pages/LoginPage.js

export class LoginPage {
	constructor(page) {
		this.page = page;

		this.inputEmail = page.getByTestId("input-email");
		this.inputSenha = page.getByTestId("input-senha");
		this.btnLogin = page.getByTestId("btn-login");
		this.alertaErro = page.getByRole("alert");
	}

	async acessar() {
		await this.page.goto("/login");
	}

	async preencherEmail(email) {
		await this.inputEmail.fill(email);
	}

	async preencherSenha(senha) {
		await this.inputSenha.fill(senha);
	}

	async clicarEntrar() {
		await this.btnLogin.click();
	}

	async login(email, senha) {
		await this.preencherEmail(email);
		await this.preencherSenha(senha);
		await this.clicarEntrar();
	}
}
