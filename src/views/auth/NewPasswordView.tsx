// importamos useState para manejar el estado del componente
import { useState } from "react";
// importamos el componente que nos pide el código de 6 dígitos
import NewPasswordToken from "@/components/auth/NewPasswordToken";
// importamos el componente que nos da el formulario para reestablecer la contraseña
import NewPasswordForm from "@/components/auth/NewPasswordForm";
// importamos el type de token
import type { ConfirmToken } from "@/types/index";

export default function NewPasswordView() {
  // creamos una variable de estado para manejar el estado del token
  const [token, setToken] = useState<ConfirmToken["token"]>("");
  // creamos una variable de estado para manejar la validacion del token
  const [isValidToken, setIsValidToken] = useState(false);

  return (
    <>
      {/* Título y subtítulo de la página */}
      <h1 className="text-5xl font-black text-white">
        Reestablecer contraseña
      </h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa el código que recibiste{" "}
        <span className="text-fuchsia-500 font-bold">por email</span>
      </p>
      {/** Formulario para ingresar el código de verificación */}
      {!isValidToken ? (
        <NewPasswordToken
          token={token}
          setToken={setToken}
          setIsValidToken={setIsValidToken}
        />
      ) : (
        <NewPasswordForm token={token} />
      )}
    </>
  );
}
