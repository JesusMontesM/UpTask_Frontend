// Importamos componentes para crear un input de PIN de 6 dígitos desde Chakra UI
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
// Importamos Link de React Router para navegar entre páginas sin recargar
import { Link } from "react-router-dom";
// Importamos el type de token
import type { ConfirmToken } from "@/types/index";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor
import { useMutation } from "@tanstack/react-query";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";
import { validateToken } from "@/api/AuthAPI";

// tipamos el componente NewPasswordToken para los datos del token
type NewPasswordTokenProps = {
  token: ConfirmToken["token"];
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewPasswordToken({
  token,
  setToken,
  setIsValidToken,
}: NewPasswordTokenProps) {
  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  // le aplicamos destructuring y asi podemos usar directamente mutate sin tener que usar mutation.mutate
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: validateToken,
    // cuando ocurra un error, se ejecuta esta función
    onError: (error) => {
      toast.error(error.message);
    },
    // cuando se ejecute correctamente, se ejecuta esta función
    onSuccess: (data) => {
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
      // cambiamos el estado de validación del token
      setIsValidToken(true);
    },
  });

  // Se ejecuta cada vez que cambia el valor del código (mientras se escribe)
  const handleChange = (token: ConfirmToken["token"]) => {
    setToken(token);
  };

  // Se ejecuta automáticamente cuando se completan los 6 dígitos
  const handleComplete = (token: ConfirmToken["token"]) => {
    mutate({ token });
  };

  return (
    <>
      {/* Formulario principal */}
      <form className="space-y-8 p-10 rounded-lg bg-white mt-10">
        {/* Etiqueta descriptiva */}
        <label className="font-normal text-2xl text-center block">
          Código de 6 dígitos
        </label>

        {/* Contenedor del input con 6 campos individuales para cada dígito */}
        <div className="flex justify-center gap-5">
          <PinInput
            value={token} // Valor del código
            onChange={handleChange} // Se llama cada vez que el valor cambia
            onComplete={handleComplete} // Se llama cuando se han completado los 6 dígitos
          >
            {/* Cada PinInputField representa un campo para un dígito */}
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
          </PinInput>
        </div>
      </form>

      {/* Enlace para solicitar un nuevo código si el usuario no lo recibió o expiró */}
      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/forgot-password"
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}
