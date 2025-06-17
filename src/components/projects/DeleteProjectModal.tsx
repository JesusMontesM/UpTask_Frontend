// Fragment nos permite envolver múltiples elementos sin añadir nodos extra al DOM
import { Fragment } from "react";
// Componente de modal con animaciones
import { Dialog, Transition } from "@headlessui/react";
// Hooks para navegación y obtener la URL actual
import { useNavigate, useLocation } from "react-router-dom";
// Hook para manejar formularios
import { useForm } from "react-hook-form";
// Componente personalizado para mostrar errores de validación
import ErrorMessage from "../ErrorMessage";
// tipamos el formulario de la contraseña
import type { CheckPasswordForm } from "@/types/index";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor
import { useMutation } from "@tanstack/react-query";
// importamos el hook que nos permite invalidar o reiniciar los datos previos de la consulta
import { useQueryClient } from "@tanstack/react-query";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";
// importamos la funcion para verificar la contraseña
import { checkPassword } from "@/api/AuthAPI";
// importamos la funcion para eliminar proyectos
import { deleteProject } from "@/api/ProjectAPI";
// importamos use effect para manejar el reinicio del formulario
import { useEffect } from "react";

export default function DeleteProjectModal() {
  // Valores iniciales para el formulario
  const initialValues: CheckPasswordForm = {
    password: "",
  };

  // Hook que retorna información de la URL actual
  const location = useLocation();
  // Hook para redirigir al usuario
  const navigate = useNavigate();

  // Obtenemos los parámetros de la URL
  const queryParams = new URLSearchParams(location.search);
  // Obtenemos el ID del proyecto a eliminar
  const deleteProjectId = queryParams.get("deleteProject")!;
  // Mostrar modal solo si hay un ID presente
  const show = deleteProjectId ? true : false;

  // Inicializamos el formulario con react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  // reseteamos el formulario cuando el modal se cierra
  useEffect(() => {
    // Si el modal se cierra (show = false), reseteamos el formulario
    if (!show) {
      reset();
    }
  }, [show, reset]);

  // creamos una variable de tipo useQueryClient para poder invalidar o reiniciar los datos previos de la consulta
  const queryClient = useQueryClient();

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  const checkUserPasswordMutation = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: checkPassword,
    onError: (error) => {
      // si ocurrió un error, mostramos el mensaje de error
      toast.error(error.message);
      reset();
    },
  });

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  const deleteProjectMutation = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: deleteProject,
    onError: (error) => {
      // si ocurrió un error, mostramos el mensaje de error
      toast.error(error.message);
    },
    onSuccess: (data) => {
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
      // Invalidamos la consulta que obtiene todos los proyectos ("projects")
      // Esto fuerza a React Query a volver a solicitar la lista actualizada de proyectos desde la API,
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // redirigimos al usuario a la página de inicio
      navigate(location.pathname, { replace: true });
      // reseteamos el formulario
      reset();
    },
  });

  // Función que manejará el submit del formulario
  const handleForm = async (formData: CheckPasswordForm) => {
    // revisamos la ocntraseña de manera asincrona
    await checkUserPasswordMutation.mutateAsync(formData);
    // si la contraseña es correcta, eliminamos el proyecto
    await deleteProjectMutation.mutateAsync(deleteProjectId);
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        // Al cerrar el modal, removemos el parámetro de la URL y mantenemos el pathname
        onClose={() => navigate(location.pathname, { replace: true })}
      >
        {/* Fondo oscuro con transición */}
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
              {/* Panel principal del modal */}
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                {/* Título del modal */}
                <Dialog.Title as="h3" className="font-black text-4xl my-5">
                  Eliminar Proyecto
                </Dialog.Title>

                {/* Mensaje descriptivo */}
                <p className="text-xl font-bold">
                  Confirma la eliminación del proyecto {""}
                  <span className="text-fuchsia-600">
                    escribiendo tu contraseña
                  </span>
                </p>

                {/* Formulario para confirmar eliminación con contraseña */}
                <form
                  className="mt-10 space-y-5"
                  onSubmit={handleSubmit(handleForm)}
                  noValidate
                >
                  {/* Campo de password */}
                  <div className="flex flex-col gap-3">
                    <label className="font-normal text-2xl" htmlFor="password">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Contraseña de Inicio de Sesión"
                      className="w-full p-3 border-gray-300 border"
                      {...register("password", {
                        required: "La Contraseña es obligatoria",
                      })}
                    />
                    {/* Mostramos error si existe */}
                    {errors.password && (
                      <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                  </div>

                  {/* Botón para confirmar eliminación */}
                  <input
                    type="submit"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl cursor-pointer"
                    value="Eliminar Proyecto"
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
