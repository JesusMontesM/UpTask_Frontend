// importamos los types de usuario
import type { teamMember } from "@/types/index";
// Importamos el hook de react-query para manejar peticiones POST, PUT, DELETE
import { useMutation } from "@tanstack/react-query";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";
// importamos la funcion para agregar usuarios al proyecto
import { addUserToProject } from "@/api/TeamAPI";
// importamos hooks de react-router-dom para navegacion y lectura de la URL
import { useNavigate, useParams } from "react-router-dom";
// importamos el hook que nos permite invalidar o reiniciar los datos previos de la consulta
import { useQueryClient } from "@tanstack/react-query";

//creamos el type de la busqueda
type SearchResultProps = {
  user: teamMember;
  reset: () => void;
};

export default function SearchResult({ user, reset }: SearchResultProps) {
  // hook para navegar entre rutas
  const navigate = useNavigate();
  // hook para acceder a la URL
  const params = useParams();
  // extraemos el id del proyecto
  const projectId = params.projectId!;

  // creamos una variable de tipo useQueryClient para poder invalidar o reiniciar los datos previos de la consulta
  const queryClient = useQueryClient();

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: addUserToProject,
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
      // cerramos el modal del formulario
      navigate(location.pathname, { replace: true });
      // invalidamos la caché del del equipo
      queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
    },
  });

  // Función que se ejecutará al hacer click en el botón Agregar al Proyecto
  const handleAddUserToProject = () => {
    const data = {
      projectId,
      id: user._id,
    };
    mutate(data);
  };

  return (
    <>
      <p className="mt-10 text-center font-bold">Resultados de la búsqueda:</p>
      <div className="flex justify-between items-center">
        <p>{user.name}</p>
        <button
          className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer"
          onClick={handleAddUserToProject}
        >
          Agregar al Proyecto
        </button>
      </div>
    </>
  );
}
