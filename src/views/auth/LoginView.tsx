// Importamos el hook useForm de react-hook-form para manejar formularios fácilmente
import { useForm } from "react-hook-form";
// Importamos el type que representa los datos que vamos a manejar en el formulario
import type { UserLoginForm } from "@/types/index";
// Importamos un componente personalizado para mostrar errores
import ErrorMessage from "@/components/ErrorMessage";
// importamos link y usenavigate para poder navegar a otra página
import { Link } from "react-router";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor
import { useMutation } from "@tanstack/react-query";
// importamos la funcion que crear una cuenta
import { authenticateUser } from "@/api/AuthAPI";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";

export default function LoginView() {
  // Valores iniciales del formulario (email y password vacíos)
  const initialValues: UserLoginForm = {
    email: "",
    password: "",
  };

  // useForm nos devuelve funciones y objetos para manejar el formulario
  const {
    register, // - register: sirve para registrar los inputs
    handleSubmit, // - handleSubmit: maneja el envío del formulario
    formState: { errors }, // - formState.errors: contiene los errores de validación
  } = useForm({ defaultValues: initialValues });

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  // le aplicamos destructuring y asi podemos usar directamente mutate sin tener que usar mutation.mutate
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: authenticateUser,
    // cuando ocurra un error, se ejecuta esta función
    onError: (error) => {
      toast.error(error.message);
    },
    // cuando se ejecute correctamente, se ejecuta esta función
    onSuccess: () => {
      // redirigimos al usuario a la página de inicio
      document.location.href = "/";
    },
  });

  // Función que se ejecuta cuando el formulario es válido y se envía
  const handleLogin = (formData: UserLoginForm) => {
    mutate(formData);
  };

  return (
    <>
      {/* Título y subtítulo de la página */}
      <h1 className="text-5xl font-black text-white">Iniciar Sesión</h1>
      <p className="text-2xl font-light text-white mt-5">
        ¿Ya tienes una cuenta? Comienza a planear tus proyectos{" "}
        <span className="text-fuchsia-500 font-bold">iniciando sesión</span>
      </p>
      {/* Formulario de login */}
      <form
        onSubmit={handleSubmit(handleLogin)} // Asocia el evento de envío con la validación y luego con handleLogin
        className="space-y-8 p-10 mt-10 bg-white"
        noValidate // Evita que el navegador haga validaciones automáticas
      >
        {/* Campo para el Email */}
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3 border-gray-300 border"
            // Registro del campo con validación personalizada
            {...register("email", {
              required: "El Email es obligatorio", // Mensaje si el campo está vacío
              pattern: {
                value: /\S+@\S+\.\S+/, // Validación del formato del email
                message: "E-mail no válido", // Mensaje si el formato no es válido
              },
            })}
          />
          {/* Mostrar error si existe */}
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        {/* Campo para la contraseña */}
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Contraseña</label>

          <input
            type="password"
            placeholder="Contraseña de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("password", {
              required: "La Contraseña es obligatorio", // Validación requerida
            })}
          />
          {/* Mostrar error si existe */}
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        {/* Botón para enviar el formulario */}
        <input
          type="submit"
          value="Iniciar Sesión"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl cursor-pointer"
        />
      </form>
      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to={"/auth/register"}
          className="text-center text-gray-300 font-normal cursor-pointer"
        >
          ¿No tienes una cuenta? Regístrate
        </Link>
        <Link
          to={"/auth/forgot-password"}
          className="text-center text-gray-300 font-normal cursor-pointer"
        >
          ¿Olvidaste tu contraseña? Solicita cambiarla
        </Link>
      </nav>
    </>
  );
}
