import axios from "axios";
//Instância centralizada do Axios:Em vez de escrever a URL completa em cada requisição, cria uma instância com a baseURL já configurada. Em produção usa a variável de ambiente da Vercel, em desenvolvimento usa o localhost.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
});
//Intercepta toda requisição antes de enviar e injeta o token JWT automaticamente no header.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
//Intercepta toda resposta que voltar do backend. Se vier um erro 401 (não autorizado), significa que o token expirou ou é inválido, então limpa o token e redireciona para o login automaticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRoute = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLoginRoute) { ////uma senha errada no login também causava redirect porque o backend retorna 401
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
