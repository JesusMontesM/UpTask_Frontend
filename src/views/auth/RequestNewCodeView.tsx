// Importamos el componente Link de React Router para navegación sin recarga
import { Link } from "react-router-dom";
// Importamos el hook useForm para manejo de formularios
import { useForm } from "react-hook-form";
// type del formulario (espera solo un campo: email)
import type { RequestConfirmationCodeForm } from "../../types";
// Componente para mostrar mensajes de error
import ErrorMessage from "@/components/ErrorMessage";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor
import { useMutation } from "@tanstack/react-query";
// importamos la funcion para solicitar un nuevo código
import { requestConfirmationCode } from "@/api/AuthAPI";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";

export default function RegisterView() {
  // Valores iniciales del formulario (email vacío)
  const initialValues: RequestConfirmationCodeForm = {
    email: "",
  };

  // Hook useForm: obtiene funciones necesarias para manejar el formulario
  const {
    register, // Para registrar inputs en el sistema de validación
    handleSubmit, // Para manejar el envío del formulario
    reset, // Para limpiar el formulario
    formState: { errors }, // Para acceder a los errores de validación
  } = useForm({ defaultValues: initialValues });

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  // le aplicamos destructuring y asi podemos usar directamente mutate sin tener que usar mutation.mutate
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: requestConfirmationCode,
    // cuando ocurra un error, se ejecuta esta función
    onError: (error) => {
      toast.error(error.message);
    },
    // cuando se ejecute correctamente, se ejecuta esta función
    onSuccess: (data) => {
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
      // resetamos el formulario
      reset();
    },
  });

  // Función que se ejecuta al enviar el formulario correctamente validado
  const handleRequestCode = (formData: RequestConfirmationCodeForm) => {
    mutate(formData);
  };

  return (
    <>
      {/* Título principal de la página */}
      <h1 className="text-5xl font-black text-white">
        Solicitar Código de Confirmación
      </h1>

      {/* Subtítulo informativo */}
      <p className="text-2xl font-light text-white mt-5">
        Coloca tu e-mail para recibir{" "}
        <span className="text-fuchsia-500 font-bold">un nuevo código</span>
      </p>

      {/* Formulario de solicitud de código */}
      <form
        onSubmit={handleSubmit(handleRequestCode)} // Ejecuta la función con datos validados
        className="space-y-8 p-10 rounded-lg bg-white mt-10"
        noValidate // Evita validación automática
      >
        <div className="flex flex-col gap-5">
          {/* Etiqueta para el campo email */}
          <label className="font-normal text-2xl" htmlFor="email">
            Email
          </label>

          {/* Campo de entrada de email */}
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3 rounded-lg border-gray-300 border"
            {...register("email", {
              required: "El Email de registro es obligatorio", // Validación: obligatorio
              pattern: {
                value: /\S+@\S+\.\S+/, // Validación: formato de email
                message: "E-mail no válido",
              },
            })}
          />

          {/* Muestra el error si existe */}
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        {/* Botón para enviar el formulario */}
        <input
          type="submit"
          value="Enviar Código"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 rounded-lg text-white font-black text-xl cursor-pointer"
        />
      </form>

      {/* Navegación adicional al final del formulario */}
      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/login"
          className="text-center text-gray-300 font-normal"
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>
        <Link
          to="/auth/forgot-password"
          className="text-center text-gray-300 font-normal"
        >
          ¿Olvidaste tu contraseña? Reestablecer
        </Link>
      </nav>
    </>
  );
}
