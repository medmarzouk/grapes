export const API_HOST = "http://localhost:8080";

import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

// Intercepteur pour attacher le token d'accès à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer l'expiration du token et rafraîchir automatiquement
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("Refresh token non disponible");
        }

        const response = await axios.post("http://127.0.0.1:8000/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem("accessToken", newAccessToken);

        // Réessaye la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Erreur de rafraîchissement du token :", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirige l'utilisateur vers la page de connexion
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
