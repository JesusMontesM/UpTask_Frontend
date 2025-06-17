// Importamos Fragment para agrupar elementos sin agregar nodos al DOM
import { Fragment } from "react";
// Importamos el componente de dialog para mostrar los mensajes al usuario, aqui es la parte visual
// Importamos el componente de transición para animar los elementos
import { Dialog, Transition } from "@headlessui/react";
// Importamos useNavigate para poder navegar entre paginas, o en este caso cerrar el modal y useParams para obtener los parámetros de la URL
import { useNavigate, useParams } from "react-router-dom";
// Importamos el tipado de tarea y el tipado de formulario
import type { TaskFormData, Task } from "@/types/index";
// importamos el hook para los formularios
import { useForm } from "react-hook-form";
// importamos el componente de formulario para editar la tarea
import TaskForm from "./TaskForm";
// importamos usemutation para hacer peticiones a la API y modificar datos del servidor y useQueryClient para invalidar los datos
import { useMutation, useQueryClient } from "@tanstack/react-query";
// importamos la funcion de editar tareas
import { updatedTask } from "@/api/TaskAPI";
// Importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";

// tipamos el componente EditTaskModal para mostrar los datos de la tarea
type EditTaskModalProps = {
  data: Task;
  taskId: Task["_id"];
};

export default function EditTaskModal({ data, taskId }: EditTaskModalProps) {
  const navigate = useNavigate();

  /** Obtener el projectId */
  // Creamos una variable que recupere los datos de la url
  const params = useParams();
  // Creamos una variable con el id del proyecto
  const projectId = params.projectId!;

  // Creamos una variable para el formulario que contiene los inputs, los errores y el handleSubmit
  const {
    register, // register nos registra cada input del formulario
    handleSubmit, // handleSubmit nos permite enviar el formulario si pasamos la validación
    reset, // reset nos permite resetear el formulario
    formState: { errors }, // formState contiene los errores del formulario
    // defaultValues es un objeto que contiene los valores iniciales del formulario
  } = useForm<TaskFormData>({
    defaultValues: {
      name: data.name,
      description: data.description,
    },
  });

  // creamos una variable de tipo useQueryClient para poder invalidar o reiniciar los datos previos de la consulta
  const queryClient = useQueryClient();

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: updatedTask,
    // cuando ocurra un error, se ejecuta esta función
    onError: (error) => {
      toast.error(error.message);
    },
    // cuando se ejecute correctamente, se ejecuta esta función
    onSuccess: (data) => {
      //  Invalidamos la consulta del proyecto completo para que actualice el listado de tareas
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      // Invalidamos la consulta que obtiene los datos de una tarea específica (getTaskById)
      // Esto fuerza a react-query a volver a solicitar los datos actualizados de la tarea desde la API
      // actualizandonos el formulario con los datos de la tarea
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
      // reseteamos el formulario
      reset();
      // cerramos el modal
      navigate(location.pathname, { replace: true });
    },
  });

  // creamos una variable a la que le pasaremos los datos del id del proyecto, tare y los datos del formulario para editar la tarea
  const handleEditTask = (formData: TaskFormData) => {
    const data = {
      projectId,
      taskId,
      formData,
    };
    // realizamos la mutacion con los datos del formulario
    mutate(data);
  };

  return (
    <Transition appear show={true} as={Fragment}>
      {/* Dialog es el componente principal del modal */}
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
        {/* Contenedor principal del modal centrado verticalmente */}
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
              {/* Panel del modal */}
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                <Dialog.Title as="h3" className="font-black text-4xl  my-5">
                  Editar Tarea
                </Dialog.Title>
                {/* Subtítulo con un mensaje descriptivo */}
                <p className="text-xl font-bold">
                  Realiza cambios a una tarea en {""}
                  <span className="text-fuchsia-600">este formulario</span>
                </p>
                {/* Formulario para editar la tarea (aún vacío) */}
                <form
                  className="mt-10 space-y-3"
                  onSubmit={handleSubmit(handleEditTask)}
                  noValidate
                >
                  {/**Renderizamos el formulario */}
                  <TaskForm register={register} errors={errors} />
                  {/* Botón para enviar el formulario */}
                  <input
                    type="submit"
                    className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                    value="Guardar Tarea"
                  />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
