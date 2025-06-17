// Importamos el componente Link desde react-router-dom
// Esto se usa para navegar entre rutas sin recargar la página
import { Link } from "react-router-dom";
// importamos las dependencias para el componente de poner el token de 6 digitos
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
// importamos useState para manejar el estado del componente
import { useState } from "react";
// importamos el type del token
import type { ConfirmToken } from "@/types/index";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor
import { useMutation } from "@tanstack/react-query";
// importamos la funcion que confirma la cuenta
import { confirmAccount } from "@/api/AuthAPI";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";

export default function ConfirmAccountView() {
  // creamos una variable de estado para manejar el token de 6 digitos
  const [token, setToken] = useState<ConfirmToken["token"]>("");

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  // le aplicamos destructuring y asi podemos usar directamente mutate sin tener que usar mutation.mutate
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: confirmAccount,
    // cuando ocurra un error, se ejecuta esta función
    onError: (error) => {
      toast.error(error.message);
    },
    // cuando se ejecute correctamente, se ejecuta esta función
    onSuccess: (data) => {
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
    },
  });

  // Función para actualizar el token cuando se ingresa en su formulario
  const handleChange = (token: ConfirmToken["token"]) => {
    setToken(token);
  };
  // Funcion para confirmar que completaste los 6 digitos
  // pasamos token para poder acceder al token completo
  const handleComplete = (token: ConfirmToken["token"]) => {
    mutate({ token });
  };

  return (
    <>
      {/* Título principal */}
      <h1 className="text-5xl font-black text-white">Confirma tu Cuenta</h1>

      {/* Subtítulo con texto informativo */}
      <p className="text-2xl font-light text-white mt-5">
        Ingresa el código que recibiste{" "}
        <span className="text-fuchsia-500 font-bold">por e-mail</span>
      </p>

      {/* Formulario para ingresar el código de verificación */}
      <form className="space-y-8 p-10 bg-white mt-10">
        <label className="font-normal text-2xl text-center block">
          Código de 6 dígitos
        </label>
        <div className="flex justify-center gap-5">
          <PinInput
            value={token}
            onChange={handleChange}
            onComplete={handleComplete}
          >
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
          </PinInput>
        </div>
      </form>

      {/* Navegación secundaria para solicitar un nuevo código */}
      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/request-code" // Redirige a la ruta que permite pedir un nuevo código
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}
