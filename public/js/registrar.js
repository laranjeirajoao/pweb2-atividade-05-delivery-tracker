const registrarForm = document.getElementById("registrarForm");
const registerMessage = document.getElementById("registerMessage");

if (registrarForm) {
	registrarForm.addEventListener("submit", async function (event) {
		event.preventDefault();

		const nome = document.getElementById("nome").value;
		const email = document.getElementById("email").value;
		const senha = document.getElementById("senha").value;

		try {
			await window.api.post("/auth/registrar", {
				nome,
				email,
				senha,
			});

			if (registerMessage) {
				registerMessage.classList.remove("form-error");
				registerMessage.classList.add("form-success");
				registerMessage.textContent = "Cadastro realizado com sucesso. Redirecionando para o login...";
			}

			setTimeout(function () {
				window.location.href = "/login";
			}, 1200);
		} catch (error) {
			const mensagens = error.response?.data?.erros;
			const mensagem = error.response?.data?.message || error.response?.data?.erro;

			if (registerMessage) {
				registerMessage.classList.remove("form-success");
				registerMessage.classList.add("form-error");
				registerMessage.textContent = Array.isArray(mensagens)
					? mensagens.join(" ")
					: mensagem || "Não foi possível realizar o cadastro";
			}
		}
	});
}
