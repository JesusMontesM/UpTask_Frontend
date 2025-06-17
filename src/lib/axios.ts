// importamos axios
import axios from "axios";

// creamos la instancia de axios con axios.create
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL de la API para que las peticiones vayan a la misma url
});

// agregamos interceptors para no repetir el token en cada peticion
api.interceptors.request.use((config) => {
  // guardamos el token en la variable token
  const token = localStorage.getItem("AUTH_TOKEN");
  // si el token existe, agregamos el token en la cabecera de la petición
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // devolvemos la configuración modificada
  return config;
});

// exportamos la instancia de axios
export default api;
