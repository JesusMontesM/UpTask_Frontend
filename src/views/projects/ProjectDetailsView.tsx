// importamos useParams para obtener los parámetros de la URL, navigate, useNavigate y Link para navegar a otra página
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
// importamos useQuery para hacer peticiones a la API
import { useQuery } from "@tanstack/react-query";
// importamos la función para mostrar los proyectos por id
import { getFullProjectById } from "@/api/ProjectAPI";
// importamos nuestro modal para agregar tareas a los proyectos
import AddTaskModal from "@/components/tasks/AddTaskModal";
// importamos nuestro modal para ver las tareas de los proyectos
import TaskList from "@/components/tasks/TaskList";
// importamos nuestro componente para editar las tareas de los proyectos
import EditTaskData from "@/components/tasks/EditTaskData";
// importamos nuestro componente para mostrar los detalles de las tareas de los proyectos
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
// importamos el hook de auth para obtener el usuario actual
import { useAuth } from "@/hooks/useAuth";
// importamos la función para verificar si un usuario es el manager de un proyecto
import { isManager } from "@/utils/policies";
// importamos useMemo para calcular si el usuario actual puede editar las tareas
import { useMemo } from "react";

export default function ProjectDetailsView() {
  // creamos una variable de tipo useAuth para obtener el usuario actual
  const { data: user, isLoading: authLoading } = useAuth();
  // creamos una variable tipo usenavigate para navegar a otra página
  const navigate = useNavigate();
  // creamos una variable tipo useparams para obtener los parámetros de la URL
  const params = useParams();
  // creamos una variable con el id del proyecto
  const projectId = params.projectId!;
  // creamos una variable de tipo useQuery para hacer peticiones a la API
  const { data, isLoading, isError } = useQuery({
    // siempre debe tener un querykey y debe ser único
    queryKey: ["project", projectId],
    // la función que se ejecutará cuando se ejecute la consulta
    queryFn: () => getFullProjectById(projectId),
    // ponemos retry a false para que no se vuelva a ejecutar la consulta si falla
    retry: false,
  });
  // instanciamos useMemo para saber si el usuario actual puede editar las tareas
  const canEdit = useMemo(() => data?.manager === user?._id, [data, user]);

  // si esta cargando, mostramos un mensaje de cargando
  if (isLoading || authLoading) return "Cargando...";
  // si hay algun error mostramos el mensaje de error
  if (isError) return <Navigate to="/404" />;
  // si el data no es undefined y tenemos un usuario, mostramos el return
  if (data && user)
    return (
      <>
        <h1 className="text-5xl font-black">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          {data.description}
        </p>
        {/* Si el usuario actual es el manager del proyecto, muestra las opciones de agregar tarea y equipo, si no no */}
        {isManager(data.manager, user._id) && (
          <nav className="my-5 flex gap-3">
            <button
              className="bg-purple-400 hover:bg-purple-600 cursor-pointer px-10 py-3 text-white text-xl font-bold transition-colors"
              onClick={() => navigate(location.pathname + `?newTask=true`)}
            >
              Agregar Tarea
            </button>
            <Link
              to={`team`}
              className="bg-fuchsia-600 hover:bg-fuchsia-800 cursor-pointer px-10 py-3 text-white text-xl font-bold transition-colors"
            >
              Equipo
            </Link>
          </nav>
        )}
        <TaskList tasks={data.tasks} canEdit={canEdit} />
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </>
    );
}
