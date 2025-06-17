// Importamos el hook para manejar formularios
import { useForm } from "react-hook-form";
// Importamos el hook para acceder a parámetros de la URL
import { useParams } from "react-router-dom";
// Importamos el hook de react-query para manejar peticiones POST, PUT, DELETE
import { useMutation } from "@tanstack/react-query";
// Componente personalizado para mostrar errores de validación
import ErrorMessage from "../ErrorMessage";
// importamos los types para el formulario de agregar miembros al equipo
import type { teamMemberForm } from "@/types/index";
// importamos la funcion para buscar usuarios
import { findUserByEmail } from "@/api/TeamAPI";
// importamos nuestro componente para mostrar los resultados de la búsqueda
import SearchResult from "./SearchResult";

export default function AddMemberForm() {
  // Valores iniciales del formulario (sólo email)
  const initialValues: teamMemberForm = {
    email: "",
  };

  // Obtenemos el ID del proyecto desde los parámetros de la URL
  const params = useParams();
  const projectId = params.projectId!; // El `!` indica que asumimos que siempre habrá un `projectId`

  // Hook de react-hook-form para manejar validaciones y estado del formulario
  const {
    register, // Registro de campos del formulario
    handleSubmit, // Manejador del evento submit
    reset, // Para reiniciar el formulario
    formState: { errors }, // Errores de validación
  } = useForm({ defaultValues: initialValues });

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  // de esta forma podemos ver los datos que nos devuelve la función
  const mutation = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: findUserByEmail,
  });

  // Función que se ejecutará al hacer submit del formulario
  const handleSearchUser = async (formData: teamMemberForm) => {
    const data = {
      projectId,
      formData,
    };
    mutation.mutate(data);
  };

  // funcion para limpiar el formulario una vez agregado el usuario
  const resetData = () => {
    reset();
    mutation.reset();
  };

  return (
    <>
      <form
        className="mt-10 space-y-5"
        onSubmit={handleSubmit(handleSearchUser)} // react-hook-form maneja el submit
        noValidate // Desactiva la validación nativa del navegador
      >
        {/* Campo de email */}
        <div className="flex flex-col gap-3">
          <label className="font-normal text-2xl" htmlFor="name">
            E-mail de Usuario
          </label>
          <input
            id="name"
            type="text"
            placeholder="E-mail del usuario a Agregar"
            className="w-full p-3 border-gray-300 border"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {/* Mostrar error si hay error de validación */}
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        {/* Botón de enviar */}
        <input
          type="submit"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl cursor-pointer"
          value="Buscar Usuario"
        />
      </form>
      <div className="mt-10">
        {/** Mientas esta cargando mostramos un mensaje de cargando */}
        {mutation.isPending && <p className="text-center">Cargando...</p>}
        {/** Si hay un error mostramos el mensaje de error */}
        {mutation.isError && (
          <p className="text-center">{mutation.error.message}</p>
        )}
        {/** Si hay algo en data mostramos los datos */}
        {mutation.data && (
          <SearchResult user={mutation.data} reset={resetData} />
        )}
      </div>
    </>
  );
}
