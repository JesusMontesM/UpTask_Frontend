// Importamos Fragment para agrupar elementos sin agregar nodos al DOM
import { Fragment } from "react";
// Importamos los componentes necesarios de Headless UI para crear el modal
import { Dialog, Transition } from "@headlessui/react";
// Importamos useLocation para poder leer la URL, useNavigate para poder navegar a otra página y useParams para obtener los parámetros de la URL
import { useLocation, useNavigate, useParams } from "react-router-dom";
// Importamos react-hook-form para crear el formulario
import { useForm } from "react-hook-form";
// Importamos el componente TaskForm para crear el formulario
import TaskForm from "@/components/tasks/TaskForm";
// importamos los types de datos del formulario
import type { TaskFormData } from "@/types/index";
// importamos useMutation para hacer peticiones a la API y modificar datos del servidor
import { useMutation } from "@tanstack/react-query";
// importamos el hook que nos permite invalidar o reiniciar los datos previos de la consulta
import { useQueryClient } from "@tanstack/react-query";
// importamos la funcion de crear tareas
import { createTask } from "@/api/TaskAPI";
// Importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";

// Componente para mostrar un modal (ventana emergente) al usuario
export default function AddTaskModal() {
  // Creamos una variable de tipo useNavigate para poder navegar a otra página
  const navigate = useNavigate();

  /** Leer si el modal existe */
  // Creamos una variable de tipo useLocation para poder leer la URL
  const location = useLocation();
  // Creamos una variable de tipo URLSearchParams para poder leer los parámetros de la URL
  const queryParams = new URLSearchParams(location.search);
  // Creamos una variable para almacenar el valor del parámetro newTask
  const modalTask = queryParams.get("newTask");
  // Creamos una variable para determinar si el modal se muestra o no convirtiendo modalTask en boolean
  const show = modalTask ? true : false;

  /** Obtener el projectId */
  // Creamos una variable que recupere los datos de la url
  const params = useParams();
  // Creamos una variable con el id del proyecto
  const projectId = params.projectId!;

  // Creamos una variable para los valores iniciales del formulario
  const initialValues: TaskFormData = {
    name: "",
    description: "",
  };
  // Creamos una variable para el formulario que contiene los inputs, los errores y el handleSubmit
  const {
    register, // register nos registra cada input del formulario
    handleSubmit, // handleSubmit nos permite enviar el formulario si pasamos la validación
    reset, // reset nos permite resetear el formulario
    formState: { errors }, // formState contiene los errores del formulario
  } = useForm<TaskFormData>({ defaultValues: initialValues }); // defaultValues es un objeto que contiene los valores iniciales del formulario

  // creamos una variable de tipo useQueryClient para poder invalidar o reiniciar los datos previos de la consulta
  const queryClient = useQueryClient();

  // Creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API y modificar datos del servidor
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: createTask,
    // cuando ocurra un error, se ejecuta esta función
    onError: (error) => {
      toast.error(error.message);
    },
    // cuando se ejecute correctamente, se ejecuta esta función
    onSuccess: (data) => {
      // Invalidamos la caché del proyecto para que la lista de tareas se actualice con la nueva tarea creada
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
      navigate(location.pathname, { replace: true }); // navegamos a la página en la que estamos
      reset(); // reseteamos el formulario
    },
  });

  // Creamos una función que envíe los datos ingresados al servidor
  const handleCreateTask = (formData: TaskFormData) => {
    // creamos un objeto con los datos del formulario y el id del proyecto
    const data = {
      formData,
      projectId,
    };
    // Llamamos a la función de mutation con el formulario
    mutate(data);
  };

  return (
    <>
      {/* Transition controla la animación de aparición/desaparición del modal */}
      <Transition appear show={show} as={Fragment}>
        {/* Dialog es el contenedor principal del modal */}
        <Dialog
          as="div"
          className="relative z-10"
          // onClose llama a la función de navegación con replace: true para que no se mantenga la URL
          // location.pathname es la ruta actual de la página
          onClose={() => navigate(location.pathname, { replace: true })}
        >
          {" "}
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
                {/* Panel principal del modal*/}
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                  <Dialog.Title as="h3" className="font-black text-4xl  my-5">
                    Nueva Tarea
                  </Dialog.Title>

                  <p className="text-xl font-bold">
                    Llena el formulario y crea {""}
                    <span className="text-fuchsia-600">una tarea</span>
                  </p>
                  <form
                    className="mt-10 space-y-3"
                    // llamamos a la función de handleSubmit con la funcion handleCreateTask
                    onSubmit={handleSubmit(handleCreateTask)}
                    noValidate
                  >
                    <TaskForm register={register} errors={errors} />
                    <input
                      type="submit"
                      value="Crear Tarea"
                      className="bg-fuchsia-600 hover:bg-fuchsia-800 cursor-pointer w-full p-3 text-white uppercase font-bold transition-colors"
                    />
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
