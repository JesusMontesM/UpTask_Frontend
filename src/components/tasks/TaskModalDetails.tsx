// Importamos Fragment para agrupar elementos sin agregar nodos al DOM
import { Fragment } from "react";
// Importamos los componentes necesarios de Headless UI para crear el modal
import { Dialog, Transition } from "@headlessui/react";
// Importamos useLocation para poder leer la URL, useNavigate para poder navegar a otra página, useParams para obtener los parámetros de la URL y Navigate para navegar a otra página
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
// importamos useQuery para hacer peticiones a la API
import { useQuery } from "@tanstack/react-query";
// importamos la funcion para ver tareas por su id y updateStatus para actualizar el estado de una tarea
import { getTaskById, updateStatus } from "@/api/TaskAPI";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";
// importamos las funciones para formatear la fecha
import { formatDate } from "@/utils/utils";
// importamos las traducciones de los estados de tareas
import { statusTranslations } from "@/locales/es";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor
import { useMutation } from "@tanstack/react-query";
// importamos el hook que nos permite invalidar o reiniciar los datos previos de la consulta
import { useQueryClient } from "@tanstack/react-query";
// importamos el type de estado de tarea
import type { TaskStatus } from "@/types/index";
// importamos el componente de panel de notas
import NotesPanel from "../notes/NotesPanel";

export default function TaskModalDetails() {
  const params = useParams();
  // creamos una variable con el id del proyecto
  const projectId = params.projectId!;
  // Creamos una variable de tipo useNavigate para poder navegar a otra página
  const navigate = useNavigate();

  /** Leer si el modal existe */
  // Creamos una variable de tipo useLocation para poder leer la URL
  const location = useLocation();
  // Creamos una variable de tipo URLSearchParams para poder leer los parámetros de la URL
  const queryParams = new URLSearchParams(location.search);
  // Creamos una variable para almacenar el valor del parámetro viewTask
  const taskId = queryParams.get("viewTask")!;
  // Creamos una variable para determinar si el modal se muestra o no convirtiendo taskId en boolean
  const show = taskId ? true : false;

  // creamos una variable de tipo useQuery para hacer peticiones a la API
  const { data, isError, error } = useQuery({
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

  // creamos una variable de tipo useQueryClient para poder invalidar o reiniciar los datos previos de la consulta
  const queryClient = useQueryClient();

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  // le aplicamos destructuring y asi podemos usar directamente mutate sin tener que usar mutation.mutate
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
      // Invalidamos la caché de la tarea individual para que el modal muestre la información más reciente
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
      navigate(location.pathname, { replace: true }); // navegamos a la página en la que estamos
    },
  });

  // creamos una función que envíe los datos ingresados al servidor
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // declaramos el estado y lo tipamos
    const status = e.target.value as TaskStatus;
    // creamos el objeto que contenga todos los datos necesarios de nuestra funcion updateStatus
    const data = {
      projectId,
      taskId,
      status,
    };
    // llamamos a la función de mutation
    mutate(data);
  };

  // si hay un error, mostramos el mensaje de error
  if (isError) {
    toast.error(error.message, { toastId: "error" }); // mostramos el mensaje de error con un id específico para evitar repetir el mensaje
    return <Navigate to={`/projects/${projectId}`} />; // mandamos al usuario a la pagina del proyecto donde estaba
  }

  if (data)
    return (
      <>
        <Transition appear show={show} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => navigate(location.pathname, { replace: true })}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/60" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                    <p className="text-sm text-slate-400">
                      Agregada el: {formatDate(data.createdAt)}
                    </p>
                    <p className="text-sm text-slate-400">
                      Última actualización: {formatDate(data.updatedAt)}
                    </p>
                    <Dialog.Title
                      as="h3"
                      className="font-black text-4xl text-slate-600 my-5"
                    >
                      {data.name}
                    </Dialog.Title>
                    <p className="text-lg text-slate-500 mb-2">
                      Descripción: {data.description}
                    </p>

                    {/** Condicional para mostrar el historial de cambios */}
                    {data.completedBy.length ? (
                      <ul className="list-decimal">
                        <p className="font-bold text-2xl text-slate-600 my-5">
                          Historial de cambios
                        </p>
                        {/** Informacion de quien modifico el estado de la tarea */}
                        {data.completedBy.map((activityLog) => (
                          <li key={activityLog._id}>
                            <span className="font-bold text-slate-600">
                              {statusTranslations[activityLog.status]}
                            </span>{" "}
                            por: {activityLog.user.name}
                            {/** ponemos la fecha de creación de la tarea en el historial de cambios */}
                            {/** en{" "} {formatDate(activityLog.createdAt)} */}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="my-5 space-y-3">
                      <label className="font-bold">
                        Estado Actual: {data.status}
                      </label>
                      <select
                        className="w-full p-3 bg-white border border-gray-300"
                        // usamos como valor el estado actual del task
                        defaultValue={data.status}
                        // llamamos a la función de handleChange con el evento de onChange
                        onChange={handleChange}
                      >
                        {/** object .entries() devuelve un array de arrays donde el primer elemento es el key y el segundo elemento es el value */}
                        {/** en este caso, el key es el estado y el value es el texto de la traducción */}
                        {Object.entries(statusTranslations).map(
                          ([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <NotesPanel notes={data.notes} />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
