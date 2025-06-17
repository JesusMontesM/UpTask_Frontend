// Importamos el menú desplegable y transición de animaciones de Headless UI
import { Menu, Transition } from "@headlessui/react";
// Fragment es necesario para agrupar elementos sin añadir nodos extra al DOM
import { Fragment } from "react";
// Ícono de tres puntos verticales que representa opciones (ver/editar/eliminar)
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
// importamos el type de tareas
import type { TaskProject } from "@/types/index";
// importamos useNavigate para poder conseguir datos de la url y useParams para obtener los parámetros de la URL
import { useNavigate, useParams } from "react-router-dom";
// importamos usemutation para hacer peticiones a la API y modificar datos del servidor y useQueryClient para invalidar los datos
import { useMutation, useQueryClient } from "@tanstack/react-query";
// importamos la funcion de eliminar tareas
import { deleteteTask } from "@/api/TaskAPI";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";
// importamos el hook que nos permite coger y mover los elementos
import { useDraggable } from "@dnd-kit/core";

// tipamos el componente TaskCard para mostrar cada tarea
type TaskCardProps = {
  task: TaskProject;
  canEdit: boolean;
};

export default function TaskCard({ task, canEdit }: TaskCardProps) {
  // creamos una variable para usar useDraggable
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  // Creamos una variable para usar useNavigate
  const navigate = useNavigate();
  // Creamos una variable que recupere los datos de la url
  const params = useParams();
  // creamos una variable con el id del proyecto
  const projectId = params.projectId!;

  // creamos una variable de tipo useQueryClient para poder invalidar o reiniciar los datos previos de la consulta
  const queryClient = useQueryClient();

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: deleteteTask,
    // cuando ocurra un error, se ejecuta esta función
    onError: (error) => {
      toast.error(error.message);
    },
    // cuando se ejecute correctamente, se ejecuta esta función
    onSuccess: (data) => {
      // Invalidamos la caché del proyecto para que se actualice la lista de tareas
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
      // cerramos el modal
      navigate(location.pathname, { replace: true });
    },
  });

  // creamos un estilo para el elemento de drag and drop
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px,${transform.y}px,0)`,
        padding: "1.25rem",
        backgroundColor: "#FFF",
        width: "300px",
        display: "flex",
        borderwidth: "1px",
        bordercolor: "rgb(203 213 225 / var(--tw-border-opacity))",
        boxshadow: "var(--tw-ring-offset-shadow), var(--tw-ring-shadow)",
        "--tw-border-opacity": "1",
        "--tw-ring-offset-shadow":
          "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
        "--tw-ring-shadow":
          "var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)",
        "--tw-ring-color": "rgb(59 130 246 / 0.5)",
      }
    : undefined;

  return (
    // Elemento de lista que representa la tarjeta
    <li className="p-5 bg-white border border-slate-300 flex justify-between gap-3">
      {/* Columna izquierda: Nombre y descripción de la tarea */}
      <div
        // Agregamos las propiedades de drag and drop
        {...listeners}
        {...attributes}
        ref={setNodeRef}
        style={style}
        className="min-w-0 flex flex-col gap-y-4"
      >
        <p className="text-xl font-bold text-slate-600 text-left cursor-pointer">
          {task.name}
        </p>
        <p className="text-slate-500">{task.description}</p>
      </div>
      {/* Columna derecha: Menú de acciones (tres puntos) */}
      <div className="flex shrink-0  gap-x-6">
        <Menu as="div" className="relative flex-none">
          {/* Botón que abre el menú de opciones */}
          <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900 cursor-pointer">
            <span className="sr-only">opciones</span>
            <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
          </Menu.Button>
          {/* Transición animada para el menú emergente */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            {/* Contenedor del menú con las opciones */}
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              {/* Opción: Ver tarea */}
              <Menu.Item>
                <button
                  type="button"
                  className="block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer"
                  onClick={() =>
                    navigate(location.pathname + `?viewTask=${task._id}`)
                  }
                >
                  Ver Tarea
                </button>
              </Menu.Item>
              {/* Si el usuario actual puede editar las tareas, muestra la opción de editar la tarea */}
              {canEdit && (
                <>
                  {/* Opción: Editar tarea */}
                  <Menu.Item>
                    <button
                      type="button"
                      className="block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer"
                      onClick={() =>
                        navigate(location.pathname + `?editTask=${task._id}`)
                      }
                    >
                      Editar Tarea
                    </button>
                  </Menu.Item>
                  {/* Opción: Eliminar tarea */}
                  <Menu.Item>
                    <button
                      type="button"
                      className="block px-3 py-1 text-sm leading-6 text-red-500 cursor-pointer"
                      // llamamos a la función de mutation con el id del proyecto al que pertenece y la tarea a eliminar
                      onClick={() => {
                        // mostramos un mensaje de confirmación para confirmar la eliminación
                        const confirmed = confirm(
                          "¿Estás seguro de que deseas eliminar esta tarea?"
                        );
                        // si confirmamos la eliminación, llamamos a la función de mutation
                        if (confirmed) {
                          mutate({ projectId, taskId: task._id });
                        }
                      }}
                    >
                      Eliminar Tarea
                    </button>
                  </Menu.Item>
                </>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </li>
  );
}
