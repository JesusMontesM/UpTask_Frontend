// Importamos el hook useForm de react-hook-form para manejar formularios
import { useForm } from "react-hook-form";
// Importamos el type de datos que usaremos en el formulario de registro
import type { UserRegistrationForm } from "@/types/index";
// Importamos un componente reutilizable para mostrar errores de validación
import ErrorMessage from "@/components/ErrorMessage";
// importamos link para poder navegar a otra página
import { Link } from "react-router-dom";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor
import { useMutation } from "@tanstack/react-query";
// importamos la funcion que crear una cuenta
import { createAccount } from "@/api/AuthAPI";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";

export default function RegisterView() {
  // Definimos los valores iniciales del formulario
  const initialValues: UserRegistrationForm = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  // Inicializamos el hook useForm con tipado y valores por defecto
  const {
    register, // Para registrar los inputs
    handleSubmit, // Para manejar el envío del formulario
    watch, // Para observar los valores en tiempo real
    reset, // Para reiniciar el formulario si es necesario
    formState: { errors }, // Objeto que contiene los errores de validación
  } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  // le aplicamos destructuring y asi podemos usar directamente mutate sin tener que usar mutation.mutate
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: createAccount,
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

  // Obtenemos el valor del campo password en tiempo real para validarlo con el de confirmación
  const password = watch("password");

  // Función que se ejecuta cuando el formulario pasa la validación
  const handleRegister = (formData: UserRegistrationForm) => {
    // llamamos a la función de mutation para crear la cuenta
    mutate(formData);
  };

  return (
    <>
      {/* Título y subtítulo de la página */}
      <h1 className="text-5xl font-black text-white">Crear Cuenta</h1>
      <p className="text-2xl font-light text-white mt-5">
        Llena el formulario para{" "}
        <span className="text-fuchsia-500 font-bold">crear tu cuenta</span>
      </p>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit(handleRegister)} // Validamos y enviamos
        className="space-y-8 p-10 bg-white mt-10"
        noValidate // Desactiva validación nativa del navegador
      >
        {/* Campo Email */}
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
              required: "El Email de registro es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        {/* Campo Nombre */}
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Nombre</label>
          <input
            type="name"
            placeholder="Nombre de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("name", {
              required: "El Nombre de usuario es obligatorio",
            })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>

        {/* Campo Password */}
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Contraseña</label>
          <input
            type="password"
            placeholder="Contraseña de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("password", {
              required: "La contraseña es obligatorio",
              minLength: {
                value: 8,
                message: "La contraseña debe ser mínimo de 8 caracteres",
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        {/* Campo Confirmación de Password */}
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Repetir Contraseña</label>
          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Contraseña de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("password_confirmation", {
              required: "Repetir contraseña es obligatorio",
              validate: (value) =>
                value === password || "Las contraseñas no coinciden",
            })}
          />
          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        {/* Botón de envío */}
        <input
          type="submit"
          value="Registrarme"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl cursor-pointer"
        />
      </form>
      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to={"/auth/login"}
          className="text-center text-gray-300 font-normal cursor-pointer"
        >
          ¿Tienes una cuenta? Inicia sesión
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
