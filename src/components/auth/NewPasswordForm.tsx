// Importamos el type que define la estructura del formulario de nueva contraseña y el token
import type { ConfirmToken, NewPasswordForm } from "../../types";
// Hook de React Router para redireccionar al usuario después de completar el formulario
import { useNavigate } from "react-router-dom";
// React Hook Form para gestionar formularios con validación
import { useForm } from "react-hook-form";
// Componente personalizado para mostrar mensajes de error
import ErrorMessage from "@/components/ErrorMessage";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor
import { useMutation } from "@tanstack/react-query";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";
// importamos la funcion para cambiar la contraseña
import { updatePasswordWithToken } from "@/api/AuthAPI";

// tipamos el componente NewPasswordToken para los datos del token
type NewPasswordFormProps = {
  token: ConfirmToken["token"];
};

export default function NewPasswordForm({ token }: NewPasswordFormProps) {
  // Inicializa useNavigate para hacer redirecciones
  const navigate = useNavigate();

  // Valores por defecto del formulario
  const initialValues: NewPasswordForm = {
    password: "",
    password_confirmation: "",
  };

  // useForm gestiona el formulario y su validación
  const {
    register, // Registra inputs para React Hook Form
    handleSubmit, // Maneja el submit del formulario
    watch, // Permite observar valores de campos (usado para confirmar password)
    reset, // Reinicia el formulario
    formState: { errors }, // Contiene los errores de validación
  } = useForm({ defaultValues: initialValues });

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  // le aplicamos destructuring y asi podemos usar directamente mutate sin tener que usar mutation.mutate
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: updatePasswordWithToken,
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
      // redirigimos al usuario a la página de login
      navigate("/auth/login");
    },
  });

  // Función que se ejecutará al enviar el formulario
  const handleNewPassword = (formData: NewPasswordForm) => {
    const data = {
      formData,
      token,
    };
    mutate(data);
  };

  // Observa el valor del password para la validación de confirmación
  const password = watch("password");

  return (
    <>
      {/* Formulario principal */}
      <form
        onSubmit={handleSubmit(handleNewPassword)} // Ejecuta validaciones y luego llama a handleNewPassword
        className="space-y-8 p-10 bg-white mt-10"
        noValidate // Desactiva la validación nativa del navegador
      >
        {/* Campo de contraseña */}
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Contraseña</label>
          <input
            type="password"
            placeholder="Contraseña de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("password", {
              required: "La Contraseña es obligatorio",
              minLength: {
                value: 8,
                message: "El Password debe ser mínimo de 8 caracteres",
              },
            })}
          />
          {/* Muestra error si lo hay */}
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        {/* Campo de confirmación de contraseña */}
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Repetir Contraseña</label>
          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Contraseña de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("password_confirmation", {
              required: "Repetir Contraseña es obligatorio",
              validate: (value) =>
                value === password || "Los Passwords no son iguales",
            })}
          />
          {/* Muestra error si lo hay */}
          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        {/* Botón para enviar el formulario */}
        <input
          type="submit"
          value="Actualizar Contraseña"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl cursor-pointer"
        />
      </form>
    </>
  );
}
