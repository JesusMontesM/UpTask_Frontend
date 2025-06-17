// Importamos el hook `useForm` de react-hook-form para manejar el formulario y validaciones
import { useForm } from "react-hook-form";
// Importamos un componente personalizado para mostrar errores
import ErrorMessage from "@/components/ErrorMessage";
// Importamos el type de datos del formulario
import type { UpdateCurrentUserPasswordForm } from "@/types/index";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor
import { useMutation } from "@tanstack/react-query";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";
// importamos la funcion para cambiar la contraseña
import { changePassword } from "@/api/ProfileAPI";

export default function ChangePasswordView() {
  // Valores iniciales del formulario (se cargan como defaultValues)
  const initialValues: UpdateCurrentUserPasswordForm = {
    current_password: "",
    password: "",
    password_confirmation: "",
  };

  // Inicializamos react-hook-form
  const {
    register, // Registra los inputs para controlarlos
    handleSubmit, // Función que maneja el submit del formulario
    watch, // Permite observar el valor de un campo en tiempo real
    reset, // Reinicia el formulario
    formState: { errors }, // Contiene los errores de validación
  } = useForm({ defaultValues: initialValues });

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: changePassword,
    // cuando ocurra un error, se ejecuta esta función
    onError: (error) => {
      toast.error(error.message);
    },
    // cuando se ejecute correctamente, se ejecuta esta función
    onSuccess: (data) => {
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
      // reseteamos el formulario
      reset();
    },
  });

  // Observamos el valor del nuevo password para compararlo con la confirmación
  const password = watch("password");

  // Esta función se ejecutará al enviar el formulario
  const handleChangePassword = (formData: UpdateCurrentUserPasswordForm) => {
    mutate(formData);
  };

  return (
    <>
      <div className="mx-auto max-w-3xl">
        {/* Título principal */}
        <h1 className="text-5xl font-black">Cambiar Contraseña</h1>

        {/* Subtítulo */}
        <p className="text-2xl font-light text-gray-500 mt-5">
          Utiliza este formulario para cambiar tu contraseña
        </p>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit(handleChangePassword)} // react-hook-form maneja validaciones y envíos
          className="mt-14 space-y-5 bg-white shadow-lg p-10 rounded-lg"
          noValidate // Desactiva la validación nativa del navegador
        >
          {/* Password actual */}
          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="current_password"
            >
              Contraseña Actual
            </label>

            <input
              id="current_password"
              type="password"
              placeholder="Password Actual"
              className="w-full p-3 border border-gray-200"
              {...register("current_password", {
                required: "El password actual es obligatorio", // Validación
              })}
            />
            {/* Mostrar error si existe */}
            {errors.current_password && (
              <ErrorMessage>{errors.current_password.message}</ErrorMessage>
            )}
          </div>

          {/* Nuevo Password */}
          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="password">
              Nueva Contraseña
            </label>

            <input
              id="password"
              type="password"
              placeholder="Nuevo Password"
              className="w-full p-3 border border-gray-200"
              {...register("password", {
                required: "La Nueva Contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "El Password debe ser mínimo de 8 caracteres", // Validación por longitud
                },
              })}
            />
            {/* Mostrar error si existe */}
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>

          {/* Confirmar Password */}
          <div className="mb-5 space-y-3">
            <label
              htmlFor="password_confirmation"
              className="text-sm uppercase font-bold"
            >
              Repetir Contraseña
            </label>

            <input
              id="password_confirmation"
              type="password"
              placeholder="Repetir Password"
              className="w-full p-3 border border-gray-200"
              {...register("password_confirmation", {
                required: "Este campo es obligatorio",
                validate: (value) =>
                  value === password || "Las contraseñas no son iguales", // Validación personalizada
              })}
            />
            {/* Mostrar error si existe */}
            {errors.password_confirmation && (
              <ErrorMessage>
                {errors.password_confirmation.message}
              </ErrorMessage>
            )}
          </div>

          {/* Botón para enviar el formulario */}
          <input
            type="submit"
            value="Cambiar Contraseña"
            className="bg-fuchsia-600 w-full p-3 text-white uppercase font-bold hover:bg-fuchsia-700 cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}
