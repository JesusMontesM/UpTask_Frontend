// Importamos el hook `useForm` de react-hook-form para manejar formularios
import { useForm } from "react-hook-form";
// Importamos Link de React Router para navegación sin recargar la página
import { Link } from "react-router-dom";
// type del formulario
import type { ForgotPasswordForm } from "../../types";
// Componente para mostrar errores de validación debajo de los inputs
import ErrorMessage from "@/components/ErrorMessage";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor
import { useMutation } from "@tanstack/react-query";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";
// importamos la funcion para reestablecer la contraseña
import { forgotPassword } from "@/api/AuthAPI";

export default function ForgotPasswordView() {
  // Valores iniciales del formulario (email vacío)
  const initialValues: ForgotPasswordForm = {
    email: "",
  };

  // Inicializa react-hook-form con los valores iniciales
  const {
    register, // Registra los inputs para la validación
    handleSubmit, // Para el envío del formulario
    reset, // Permite limpiar el formulario
    formState: { errors }, // Contiene los errores de validación
  } = useForm({ defaultValues: initialValues });

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  // le aplicamos destructuring y asi podemos usar directamente mutate sin tener que usar mutation.mutate
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: forgotPassword,
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

  // Función que se ejecuta cuando el formulario pasa la validación y se envía
  const handleForgotPassword = (formData: ForgotPasswordForm) => {
    mutate(formData);
  };

  return (
    <>
      {/* Título y subtítulo de la página */}
      <h1 className="text-5xl font-black text-white">
        Reestablecer Contraseña
      </h1>
      <p className="text-2xl font-light text-white mt-5">
        ¿Olvidaste tu contraseña? Ingresa tu email{" "}
        <span className="text-fuchsia-500 font-bold">
          y reestablece tu contraseña
        </span>
      </p>
      {/* Formulario principal */}
      <form
        onSubmit={handleSubmit(handleForgotPassword)} // react-hook-form maneja validación y envío
        className="space-y-8 p-10 mt-10 bg-white"
        noValidate
      >
        {/* Campo de Email */}
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl" htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("email", {
              required: "El Email de registro es obligatorio", // Validación: requerido
              pattern: {
                value: /\S+@\S+\.\S+/, // Validación: formato de email
                message: "E-mail no válido",
              },
            })}
          />

          {/* Si hay errores, los mostramos debajo del input */}
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        {/* Botón para enviar el formulario */}
        <input
          type="submit"
          value="Enviar Correo"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl cursor-pointer"
        />
      </form>

      {/* Navegación para otras acciones (login o registrarse) */}
      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/login"
          className="text-center text-gray-300 font-normal"
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>

        <Link
          to="/auth/register"
          className="text-center text-gray-300 font-normal"
        >
          ¿No tienes cuenta? Crea una
        </Link>
      </nav>
    </>
  );
}
