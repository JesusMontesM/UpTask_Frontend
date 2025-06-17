// importamos la base de nuestras consultas
import api from "@/lib/axios";
// importamos los errores
import { isAxiosError } from "axios";
// importamos los types necesarios
import {
  type ConfirmToken,
  type RequestConfirmationCodeForm,
  type UserLoginForm,
  type UserRegistrationForm,
  type ForgotPasswordForm,
  type NewPasswordForm,
  userSchema,
  type CheckPasswordForm,
} from "@/types/index";

// creamos una función asíncrona para crear una cuenta
export async function createAccount(formData: UserRegistrationForm) {
  try {
    // guardamos nuestra url
    const url = "/auth/create-account";
    // enviamos el formulario a la API con la url y el método post con los datos de formData
    const { data } = await api.post<string>(url, formData);
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

// creamos una función asíncrona para confirmar una cuenta
export async function confirmAccount(formData: ConfirmToken) {
  try {
    // guardamos nuestra url
    const url = "/auth/confirm-account";
    // enviamos el formulario a la API con la url y el método post con los datos de formData
    const { data } = await api.post<string>(url, formData);
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

// creamos una función asíncrona para enviar un codigo nuevo
export async function requestConfirmationCode(
  formData: RequestConfirmationCodeForm
) {
  try {
    // guardamos nuestra url
    const url = "/auth/request-code";
    // enviamos el formulario a la API con la url y el método post con los datos de formData
    const { data } = await api.post<string>(url, formData);
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

// creamos una función asíncrona para autenticar un usuario (login)
export async function authenticateUser(formData: UserLoginForm) {
  try {
    // guardamos nuestra url
    const url = "/auth/login";
    // enviamos el formulario a la API con la url y el método post con los datos de formData
    const { data } = await api.post<string>(url, formData);
    // guardamos el token de inicio de sesión en el localStorage
    localStorage.setItem("AUTH_TOKEN", data);
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

// creamos una función asíncrona para enviar el email para reestablecer la contraseña
export async function forgotPassword(formData: ForgotPasswordForm) {
  try {
    // guardamos nuestra url
    const url = "/auth/forgot-password";
    // enviamos el formulario a la API con la url y el método post con los datos de formData
    const { data } = await api.post<string>(url, formData);
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

// creamos una función asíncrona para confirmar el token
export async function validateToken(formData: ConfirmToken) {
  try {
    // guardamos nuestra url
    const url = "/auth/validate-token";
    // enviamos el formulario a la API con la url y el método post con los datos de formData
    const { data } = await api.post<string>(url, formData);
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
export async function updatePasswordWithToken({
  formData,
  token,
}: {
  formData: NewPasswordForm;
  token: ConfirmToken["token"];
}) {
  try {
    // guardamos nuestra url
    const url = `/auth/update-password/${token}`;
    // enviamos el formulario a la API con la url y el método post con los datos de formData
    const { data } = await api.post<string>(url, formData);
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

// creamos una función asíncrona para reconocer al usuario
export async function getUser() {
  try {
    // guardamos nuestra url
    const url = `/auth/user`;
    // enviamos el formulario a la API con la url y el método get
    const { data } = await api(url);
    // parseamos el data con el schema de user
    const response = userSchema.safeParse(data);
    // si el data tiene el mismo esquema que el schema de user, devolvemos el data
    if (response.success) {
      return response.data;
    }
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

// creamos una función asíncrona para revisar la contraseña
export async function checkPassword(formData: CheckPasswordForm) {
  try {
    // guardamos nuestra url
    const url = `/auth/check-password`;
    // enviamos el formulario a la API con la url y el método post con los datos de formData
    const { data } = await api.post<string>(url, formData);
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
