const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

if (form) {
	form.addEventListener("submit", async function (event) {
		event.preventDefault();

		const email = document.getElementById("email").value;
		const senha = document.getElementById("senha").value;

		try {
			const response = await window.api.post("/auth/login", {
				email,
				senha,
			});

			const { accessToken, refreshToken } = response.data;

			localStorage.setItem("accessToken", accessToken);
			localStorage.removeItem("token");

			if (refreshToken) {
				localStorage.setItem("refreshToken", refreshToken);
			}

			window.location.href = "/painel";
		} catch (error) {
			if (errorMessage) {
				errorMessage.textContent = "E-mail ou senha inválidos";
			}
		}
	});
}
