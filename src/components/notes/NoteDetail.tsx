// importamos el type de nota
import type { Note } from "@/types/index";
// importamos la funcion para formatear la fecha
import { formatDate } from "@/utils/utils";
// importamos nuestro hook de autenticación
import { useAuth } from "@/hooks/useAuth";
// importamos usememo
import { useMemo } from "react";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor y useQueryClient para invalidar los datos
import { useMutation, useQueryClient } from "@tanstack/react-query";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";
// importamos la funcion de eliminar notas
import { deleteNote } from "@/api/NoteAPI";
// hooks para la url
import { useLocation, useParams } from "react-router-dom";

// tipamos
type NoteDetailProps = {
  note: Note;
};
export default function NoteDetail({ note }: NoteDetailProps) {
  const { data, isLoading } = useAuth();
  // variable para detectar si puedes eliminar una nota
  const canDelete = useMemo(
    () => data?._id === note.createdBy._id,
    [data, note.createdBy._id]
  );

  // creamos una variable de tipo useParams para obtener el id del proyecto
  const params = useParams();
  // Creamos una variable de tipo useLocation para poder leer la URL
  const location = useLocation();
  // Creamos una variable de tipo URLSearchParams para poder leer los parámetros de la URL
  const queryParams = new URLSearchParams(location.search);
  // Creamos una variable para almacenar el valor del parámetro viewTask
  const taskId = queryParams.get("viewTask")!;
  // creamos una variable con el id del proyecto
  const projectId = params.projectId!;

  // creamos una variable de tipo useQueryClient para poder invalidar o reiniciar los datos previos de la consulta
  const queryClient = useQueryClient();
  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: deleteNote,
    // cuando ocurra un error, se ejecuta esta función
    onError: (error) => {
      toast.error(error.message);
    },
    // cuando se ejecute correctamente, se ejecuta esta función
    onSuccess: (data) => {
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
      // Invalidamos la caché
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  // si el usuario no está autentificado, redirige al login
  if (isLoading) return <p>Cargando...</p>;
  return (
    <div className="p-3 flex justify-between items-center">
      <div>
        <p>
          {note.content} por:{" "}
          <span className="font-bold">{note.createdBy.name}</span>
        </p>
        <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
      </div>
      {canDelete && (
        <button
          type="button"
          className="bg-red-400 hover:bg-red-600 cursor-pointer p-2 text-xs text-white font-bold transition-colors"
          onClick={() => {
            // mostramos un mensaje de confirmación para confirmar la eliminación
            const confirmed = confirm(
              "¿Estás seguro de que deseas eliminar esta nota?"
            );
            // si confirmamos la eliminación, llamamos a la función de mutation
            if (confirmed) {
              mutate({ projectId, taskId, noteId: note._id });
            }
          }}
        >
          Eliminar
        </button>
      )}
    </div>
  );
}
