// importamos el contexto de drag and drop
import { DndContext } from "@dnd-kit/core";
// importamos el tipo de evento de drag and drop
import type { DragEndEvent } from "@dnd-kit/core";
// importamos el type de tareas
import type { Project, TaskProject, TaskStatus } from "@/types/index";
// importamos el componente de tarjeta para mostrar cada tarea
import TaskCard from "./TaskCard";
// importamos las traducciones de los estados de tareas
import { statusTranslations } from "@/locales/es";
// importamos el componente de dropTask para modificar el estado con dndkit
import DropTask from "./DropTask";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor
import { useMutation } from "@tanstack/react-query";
// importamos el hook que nos permite invalidar o reiniciar los datos previos de la consulta
import { useQueryClient } from "@tanstack/react-query";
// Importamos useParams para obtener los parámetros de la URL
import { useParams } from "react-router-dom";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";
// importamos la funcion para actualizar el estado de una tarea
import { updateStatus } from "@/api/TaskAPI";

// tipamos el componente TaskList para mostrar las tareas de un proyecto
type TaskListProps = {
  tasks: TaskProject[];
  canEdit: boolean;
};

// tipamos GroupedTasks para agrupar las tareas por status
type GroupedTasks = {
  [key: string]: TaskProject[];
};

// declaramos los valores iniciales de los estados de tareas
const initialStatusGroups: GroupedTasks = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: [],
};

// declaramos los estilos de los estados de tareas
const statusStyles: { [key: string]: string } = {
  pending: "border-t-slate-500",
  onHold: "border-t-red-500",
  inProgress: "border-t-blue-500",
  underReview: "border-t-amber-500",
  completed: "border-t-emerald-500",
};

export default function TaskList({ tasks, canEdit }: TaskListProps) {
  // creamos una variable de tipo useParams para obtener el id del proyecto
  const params = useParams();
  // creamos una variable con el id del proyecto
  const projectId = params.projectId!;
  // creamos una variable de tipo useQueryClient para poder invalidar o reiniciar los datos previos de la consulta
  const queryClient = useQueryClient();
  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: updateStatus,
    // cuando ocurra un error, se ejecuta esta función
    onError: (error) => {
      toast.error(error.message);
    },
    // cuando se ejecute correctamente, se ejecuta esta función
    onSuccess: (data) => {
      // Invalidamos la caché del proyecto para que se actualicen sus datos (como las tareas en sus columnas)
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
    },
  });
  const groupedTasks = tasks.reduce((acc, task) => {
    // Verificamos si ya existe un grupo para el status actual de la tarea
    // Si existe, hacemos una copia del array de tareas existente
    // Si no existe, inicializamos como un array vacío
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    // Agregamos la tarea actual al grupo correspondiente
    currentGroup = [...currentGroup, task];
    // Devolvemos el acumulador actualizado, agregando o reemplazando el grupo con el nuevo array
    return { ...acc, [task.status]: currentGroup };
    // El valor inicial es un objeto vacío, donde se guardarán los grupos por status
  }, initialStatusGroups);
  // creamos la funcion para el dnd
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    // si arrastramos el elemento a un droppable
    if (over && over.id) {
      const taskId = active.id.toString();
      const status = over.id as TaskStatus;
      mutate({ projectId, taskId, status });
      // actualizamos el estado del queryClient
      queryClient.setQueryData(["project", projectId], (prevData: Project) => {
        const updatedTasks = prevData.tasks.map((task) => {
          // si el id de la tarea coincide con el id del evento, actualizamos el estado
          if (task._id === taskId) {
            return { ...task, status };
          }
          return task;
        });
        return { ...prevData, tasks: updatedTasks };
      });
    }
  };

  return (
    <>
      <h2 className="text-5xl font-black my-10">Tareas</h2>

      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
        {/* Creamos el contexto de drag and drop */}
        <DndContext
          // llamamos a la función handleDragEnd cuando el usuario deje la tarea
          onDragEnd={handleDragEnd}
        >
          {/* Recorremos el objeto groupedTasks, que tiene las tareas agrupadas por status */}
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">
              <h3
                className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`}
              >
                {statusTranslations[status]}
              </h3>
              <DropTask
                // Agregamos el status como propiedad para que el componente DropTask sepa que status es el que está sobre el elemento
                status={status}
              />
              <ul className="mt-5 space-y-5">
                {/* Si no hay tareas en este grupo, mostramos un mensaje */}
                {tasks.length === 0 ? (
                  <li className="text-gray-500 text-center pt-3">
                    No Hay tareas
                  </li>
                ) : (
                  // Si hay tareas, renderizamos una tarjeta por cada una
                  tasks.map((task) => (
                    <TaskCard key={task._id} task={task} canEdit={canEdit} />
                  ))
                )}
              </ul>
            </div>
          ))}
        </DndContext>
      </div>
    </>
  );
}
// }
