// importamos el error de axios
import { isAxiosError } from "axios";
// importamos los types necesarios
import type { UpdateCurrentUserPasswordForm, UserProfileForm } from "../types";
// importamos la base de nuestras consultas
import api from "@/lib/axios";

// creamos una función asíncrona para editar el perfil
export async function updateProfile(formData: UserProfileForm) {
  try {
    // mandamos los datos con la url y los datos del form en el método put
    const { data } = await api.put<string>("/auth/profile", formData);
    // return para poder usar el data en otras funciones
    return data;
  } catch (error) {
    // si el error es un axios error y tiene una respuesta, devolvemos el mensaje de error
    if (isAxiosError(error) && error.response) {
      // creamos un error para mostrarlo al usuario
      throw new Error(error.response.data.error);
    }
  }
}

// creamos una función asíncrona para cambiar la contraseña
export async function changePassword(formData: UpdateCurrentUserPasswordForm) {
  try {
    // mandamos los datos con la url y los datos del form en el método post
    const { data } = await api.post<string>("/auth/update-password", formData);
    // return para poder usar el data en otras funciones
    return data;
  } catch (error) {
    // si el error es un axios error y tiene una respuesta, devolvemos el mensaje de error
    if (isAxiosError(error) && error.response) {
      // creamos un error para mostrarlo al usuario
      throw new Error(error.response.data.error);
    }
  }
}
