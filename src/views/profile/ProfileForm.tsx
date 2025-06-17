// Importamos react-hook-form para manejar el formulario y validación
import { useForm } from "react-hook-form";
// Importamos el componente para mostrar mensajes de error
import ErrorMessage from "@/components/ErrorMessage";
// Importamos nuestro type de usuario
import type { User, UserProfileForm } from "@/types/index";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor
import { useMutation } from "@tanstack/react-query";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";
// importamos el hook que nos permite invalidar o reiniciar los datos previos de la consulta
import { useQueryClient } from "@tanstack/react-query";
// funcion para editar el perfil
import { updateProfile } from "@/api/ProfileAPI";

// tipamos los datos del formulario
type ProfileFormProps = {
  data: User;
};

export default function ProfileForm({ data }: ProfileFormProps) {
  // Inicializamos react-hook-form
  const {
    register, // Para registrar inputs en el formulario
    handleSubmit, // Para manejar el envío del formulario
    formState: { errors }, // Accedemos a los errores de validación
  } = useForm<UserProfileForm>({ defaultValues: data }); // Precargamos valores con los datos del usuario

  // creamos una variable de tipo useQueryClient para poder invalidar o reiniciar los datos previos de la consulta
  const queryClient = useQueryClient();

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: updateProfile,
    // cuando ocurra un error, se ejecuta esta función
    onError: (error) => {
      toast.error(error.message);
    },
    // cuando se ejecute correctamente, se ejecuta esta función
    onSuccess: (data) => {
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
      // invalidamos el cache
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  // Función que se ejecuta al enviar el formulario
  const handleEditProfile = (formData: UserProfileForm) => {
    mutate(formData);
  };

  return (
    <>
      {/* Contenedor principal del formulario */}
      <div className="mx-auto max-w-3xl">
        {/* Título principal */}
        <h1 className="text-5xl font-black">Mi Perfil</h1>
        {/* Subtítulo */}
        <p className="text-2xl font-light text-gray-500 mt-5">
          Aquí puedes actualizar tu información
        </p>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit(handleEditProfile)} // Validación + envío
          className="mt-14 space-y-5 bg-white shadow-lg p-10 rounded-l"
          noValidate // Desactivamos la validación HTML por defecto
        >
          {/* Campo: Nombre */}
          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              placeholder="Tu Nombre"
              className="w-full p-3 border border-gray-200"
              // Registramos el input y agregamos la validación
              {...register("name", {
                required: "Nombre de usuario es obligatorio",
              })}
            />
            {/* Mostrar error si falta el nombre */}
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>

          {/* Campo: Email */}
          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="Tu Email"
              className="w-full p-3 border border-gray-200"
              {...register("email", {
                required: "El e-mail es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "E-mail no válido",
                },
              })}
            />
            {/* Mostrar error si el email es inválido */}
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </div>

          {/* Botón para enviar el formulario */}
          <input
            type="submit"
            value="Guardar Cambios"
            className="bg-fuchsia-600 w-full p-3 text-white uppercase font-bold hover:bg-fuchsia-700 cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}
