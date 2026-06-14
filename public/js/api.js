const api = axios.create({
	baseURL: "/api",
});

api.interceptors.request.use(
	function (config) {
		const token = localStorage.getItem("accessToken");

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	function (error) {
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	function (response) {
		return response;
	},
	function (error) {
		if (error.response && error.response.status === 401) {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("token");

			if (window.location.pathname !== "/login") {
				window.location.href = "/login";
			}
		}

		if (error.response && error.response.status === 403) {
			window.location.href = "/painel/sem-permissao";
		}

		return Promise.reject(error);
	},
);

window.api = api;
