// importamos fragment para agrupar elementos sin añadir nodos al DOM
import { Fragment } from "react";
// importamos los componentes de transición y Menu de Headless UI
import { Menu, Transition } from "@headlessui/react";
// importamos el icono de tres puntos para el menú desplegable
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
// importamos useParams para obtener los parámetros de la URL, useNavigate, Navigate y Link para navegar a otra página
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
// importamos useQuery para hacer peticiones a la API
import { useQuery } from "@tanstack/react-query";
// importamos nuestro modal para agregar miembros al equipo
import AddMemberModal from "@/components/team/AddMemberModal";
// importamos la funcion para ver los miembros del equipo y eliminar usuarios del equipo
import { getProjectTeam, removeUserFromProject } from "@/api/TeamAPI";
// Importamos el hook de react-query para manejar peticiones POST, PUT, DELETE
import { useMutation } from "@tanstack/react-query";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";
// importamos los types de usuario
import type { teamMember } from "@/types/index";
// importamos el hook que nos permite invalidar o reiniciar los datos previos de la consulta
import { useQueryClient } from "@tanstack/react-query";

export default function ProjectTeamView() {
  // instanciamos la función useNavigate para navegar a otra página
  const navigate = useNavigate();
  // instanciamos la función useParams para obtener los parámetros de la URL
  const params = useParams();
  // creamos una variable con el id del proyecto
  const projectId = params.projectId!;

  // creamos una variable de tipo useQuery para hacer peticiones a la API
  const { data, isLoading, isError } = useQuery({
    // siempre debe tener un querykey y debe ser único
    queryKey: ["projectTeam", projectId],
    // la función que se ejecutará cuando se ejecute la consulta
    queryFn: () => getProjectTeam(projectId),
    // ponemos retry a false para que no se vuelva a ejecutar la consulta si falla
    retry: false,
  });

  // creamos una variable de tipo useQueryClient para poder invalidar o reiniciar los datos previos de la consulta
  const queryClient = useQueryClient();

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: removeUserFromProject,
    // cuando ocurra un error, se ejecuta esta función
    onError: (error) => {
      toast.error(error.message);
    },
    // cuando se ejecute correctamente, se ejecuta esta función
    onSuccess: (data) => {
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
      // invalidamos la caché del del equipo
      queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
    },
  });

  // Función que se ejecutará al hacer click en el botón Eliminar del Proyecto
  const handleRemoveUserFromProject = (userId: teamMember["_id"]) => {
    const data = {
      projectId,
      userId,
    };
    mutate(data);
  };

  // mientas esta cargando mostramos un mensaje de cargando
  if (isLoading) return "Cargando...";
  // si hay algun error mostramos el mensaje de error
  if (isError) return <Navigate to={"/404"} />;
  // si tenemos algo en data mostramos el equipo
  if (data)
    return (
      <>
        <h1 className="text-5xl font-black">Administrar equipo</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Administra el equipo de trabajo para este proyecto
        </p>
        <nav className="my-5 flex gap-3">
          <button
            className="bg-purple-400 hover:bg-purple-600 cursor-pointer px-10 py-3 text-white text-xl font-bold transition-colors"
            onClick={() => navigate(location.pathname + `?addMember=true`)}
          >
            Agregar usuarios al equipo
          </button>
          <Link
            to={`/projects/${projectId}`}
            className="bg-fuchsia-600 hover:bg-fuchsia-800 cursor-pointer px-10 py-3 text-white text-xl font-bold transition-colors"
          >
            Volver al proyecto
          </Link>
        </nav>

        {/* Título de la sección */}
        <h2 className="text-5xl font-black my-10">Miembros del equipo </h2>

        {/* Validamos si hay miembros en el array `data` */}
        {data.length ? (
          // Si hay miembros, mostramos una lista estilizada
          <ul
            role="list"
            className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg"
          >
            {/* Iteramos sobre cada miembro */}
            {data?.map((member) => (
              <li
                key={member._id}
                className="flex justify-between gap-x-6 px-5 py-10"
              >
                {/* Parte izquierda: info del usuario */}
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <p className="text-2xl font-black text-gray-600">
                      {member.name}
                    </p>
                    <p className="text-sm text-gray-400">{member.email}</p>
                  </div>
                </div>

                {/* Parte derecha: botón de opciones */}
                <div className="flex shrink-0 items-center gap-x-6">
                  {/* Menú desplegable con opciones para cada miembro */}
                  <Menu as="div" className="relative flex-none">
                    {/* Botón del menú con icono de tres puntos */}
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                      <span className="sr-only">opciones</span>
                      <EllipsisVerticalIcon
                        className="h-9 w-9"
                        aria-hidden="true"
                      />
                    </Menu.Button>

                    {/* Transición del menú */}
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      {/* Contenido del menú desplegable */}
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <Menu.Item>
                          {/* Botón para eliminar al miembro del proyecto */}
                          <button
                            type="button"
                            className="block px-3 py-1 text-sm leading-6 text-red-500 cursor-pointer"
                            // llamamos a la función handleRemoveUserFromProject con el id del miembro
                            onClick={() => {
                              // mostramos un mensaje de confirmación para confirmar la eliminación
                              const confirmed = confirm(
                                "¿Estás seguro de que deseas eliminar este miembro del equipo?"
                              );
                              // si confirmamos la eliminación, llamamos a la función de mutation
                              if (confirmed) {
                                handleRemoveUserFromProject(member._id);
                              }
                            }}
                          >
                            Eliminar del Proyecto
                          </button>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          // Si no hay miembros, mostramos este mensaje
          <p className="text-center py-20">No hay miembros en este equipo</p>
        )}

        <AddMemberModal />
      </>
    );
}
