(function () {
	const token = localStorage.getItem("accessToken");
	const currentPath = window.location.pathname;
	const loginPath = "/login";
	const usuario = token ? obterPayloadToken(token) : null;
	const papel = usuario?.papel;

	const publicRoutes = [
		loginPath,
		"/registrar",
		"/painel/auth/login",
		"/painel/auth/registrar",
	];
	const protectedRoutes = [
		"/painel",
		"/painel/entregas",
		"/painel/motoristas",
		"/painel/relatorios",
		"/painel/sem-permissao",
	];
	const roleProtectedRoutes = [
		{ path: "/painel/relatorios", papeis: ["GESTOR"] },
		{ path: "/painel/motoristas/nova", papeis: ["GESTOR"] },
	];

	const isPublicRoute = publicRoutes.includes(currentPath);
	const isProtectedRoute = protectedRoutes.some(function (route) {
		if (route === "/painel") {
			return currentPath === route;
		}

		return currentPath === route || currentPath.startsWith(`${route}/`);
	});
	const roleRule = roleProtectedRoutes.find(function (rule) {
		return currentPath === rule.path || currentPath.startsWith(`${rule.path}/`);
	});

	function obterPayloadToken(jwt) {
		try {
			const payload = jwt.split(".")[1];
			let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
			base64 += "=".repeat((4 - (base64.length % 4)) % 4);
			return JSON.parse(atob(base64));
		} catch (error) {
			return null;
		}
	}

	function possuiPapel(papeisPermitidos) {
		return papeisPermitidos.includes(papel);
	}

	function atualizarElementosDeAutenticacao() {
		const authenticatedElements = document.querySelectorAll(
			"[data-authenticated-only]",
		);
		const roleElements = document.querySelectorAll("[data-role-required]");

		authenticatedElements.forEach(function (element) {
			element.hidden = !token;
		});

		roleElements.forEach(function (element) {
			const papeisPermitidos = element.dataset.roleRequired
				.split(",")
				.map(function (role) {
					return role.trim();
				});

			element.hidden = !token || !possuiPapel(papeisPermitidos);
		});
	}

	function bloquearAcoesSemPermissao() {
		const protectedForms = document.querySelectorAll("form[data-role-required]");

		protectedForms.forEach(function (form) {
			form.addEventListener("submit", function (event) {
				const papeisPermitidos = form.dataset.roleRequired
					.split(",")
					.map(function (role) {
						return role.trim();
					});

				if (!token || !possuiPapel(papeisPermitidos)) {
					event.preventDefault();
					window.location.href = "/painel/sem-permissao";
				}
			});
		});
	}

	function inicializarControleDeAcesso() {
		atualizarElementosDeAutenticacao();
		bloquearAcoesSemPermissao();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", inicializarControleDeAcesso);
	} else {
		inicializarControleDeAcesso();
	}

	if (!token && isProtectedRoute) {
		window.location.href = loginPath;
		return;
	}

	if (token && isPublicRoute) {
		window.location.href = "/painel";
		return;
	}

	if (token && roleRule && !possuiPapel(roleRule.papeis)) {
		window.location.href = "/painel/sem-permissao";
	}
})();
