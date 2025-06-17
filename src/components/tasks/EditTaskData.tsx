// importamos useLocation para poder leer la URL, useParams para obtener los parámetros de la URL y Navigate para navegar a otra página
import { Navigate, useLocation, useParams } from "react-router-dom";
// importamos useQuery para hacer peticiones a la API
import { useQuery } from "@tanstack/react-query";
// importamos la función para mostrar las tareas por id
import { getTaskById } from "@/api/TaskAPI";
// importamos el componente de modal para editar las tareas
import EditTaskModal from "./EditTaskModal";

export default function EditTaskData() {
  const params = useParams();
  // creamos una variable con el id del proyecto
  const projectId = params.projectId!;

  /** Leer si el modal existe */
  // Creamos una variable de tipo useLocation para poder leer la URL
  const location = useLocation();
  // Creamos una variable de tipo URLSearchParams para poder leer los parámetros de la URL
  const queryParams = new URLSearchParams(location.search);
  // Creamos una variable para almacenar el valor del parametro
  const taskId = queryParams.get("editTask")!;
  // creamos una variable de tipo useQuery para hacer peticiones a la API
  const { data, isError } = useQuery({
    // siempre debe tener un querykey y debe ser único
    queryKey: ["task", taskId],
    // la función que se ejecutará cuando se ejecute la consulta
    queryFn: () => getTaskById({ projectId, taskId }),
    // (!!) es una forma de convertir a boolean una variable
    // enabled es una propiedad de useQuery que se usa para habilitar o deshabilitar la consulta en funcion de un boolean
    enabled: !!taskId,
    // ponemos retry a false para que no se vuelva a ejecutar la consulta si falla
    retry: false,
  });

  if (isError) return <Navigate to="/404" />; // si hay un error, mostramos el mensaje de error

  if (data) return <EditTaskModal data={data} taskId={taskId} />; // si tenemos datos, mostramos el modal
  // taskId={taskId} para pasar el id de la tarea a la función de EditTaskModal
}
