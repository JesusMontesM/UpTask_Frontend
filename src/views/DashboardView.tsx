// importamos las dependencias necesarias para el componente que muestra los proyectos
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
// importamos link de react router dom para el componente Link y navigate para movernos por las url y useLocation para obtener la URL actual
import { Link, useLocation, useNavigate } from "react-router-dom";
// importamos useQuery para hacer peticiones a la API
import { useQuery } from "@tanstack/react-query";
// importamos las funciones para mostrar los proyectos
import { getProjects } from "@/api/ProjectAPI";
// importamos el hook de auth para obtener el usuario actual
import { useAuth } from "@/hooks/useAuth";
// importamos la función para verificar si un usuario es el manager de un proyecto
import { isManager } from "@/utils/policies";
// importamos el componente modal para eliminar proyectos
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";

export default function DashboardView() {
  // Hook para obtener la URL actual
  const location = useLocation();
  const navigate = useNavigate();
  // creamos una variable de tipo useAuth para obtener el usuario actual
  const { data: user, isLoading: authLoading } = useAuth();
  // creamos una variable de tipo useQuery para hacer peticiones a la API
  const { data, isLoading } = useQuery({
    // siempre debe tener un querykey y debe ser único
    queryKey: ["projects"],
    // la función que se ejecutará cuando se ejecute la consulta
    queryFn: () => getProjects(),
  });

  // si esta cargando, mostramos un mensaje de cargando
  if (isLoading || authLoading) return "Cargando...";

  // si el data no es undefined y tenemos un usuario, mostramos el return
  if (data && user)
    return (
      <>
        <h1 className="text-5xl font-black">Mis Proyectos</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Administra tus proyectos
        </p>
        <nav className="my-5">
          <Link
            className="bg-purple-400 hover:bg-purple-600 cursor-pointer px-10 py-3 text-white text-xl font-bold transition-colors"
            to="/projects/create"
          >
            Nuevo Proyecto
          </Link>
        </nav>
        {/*si el data tiene algo se muestra lo primero */}
        {data.length ? (
          <ul
            role="list"
            className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg"
          >
            {data.map((project) => (
              <li
                key={project._id}
                className="flex justify-between gap-x-6 px-5 py-10"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <div className="mb-2">
                      {/* Le mostramos al usuario su rol en el proyecto */}
                      {isManager(project.manager, user._id) ? (
                        <p className="font-bold text-xs uppercase bg-indigo-50 text-indigo-500 border-2 border-indigo-500 rounded-lg inline-block py-1 px-5">
                          Manager
                        </p>
                      ) : (
                        <p className="font-bold text-xs uppercase bg-green-50 text-green-500 border-2 border-green-500 rounded-lg inline-block py-1 px-5">
                          Miembro del equipo
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/projects/${project._id}`} // navegamos a la ruta de detalles del proyecto
                      className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                    >
                      {project.projectName}
                    </Link>
                    <p className="text-sm text-gray-400">
                      Cliente: {project.clientName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-6">
                  <Menu as="div" className="relative flex-none">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900 cursor-pointer">
                      <span className="sr-only">opciones</span>
                      <EllipsisVerticalIcon
                        className="h-9 w-9"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <Menu.Item>
                          <Link
                            to={`/projects/${project._id}`} // navegamos a la ruta de detalles del proyecto
                            className="block px-3 py-1 text-sm leading-6 text-gray-900"
                          >
                            Ver Proyecto
                          </Link>
                        </Menu.Item>
                        {/* Si el usuario actual es el manager del proyecto, muestra el link para editar y eliminar */}
                        {isManager(project.manager, user._id) && (
                          <>
                            <Menu.Item>
                              <Link
                                to={`/projects/${project._id}/edit`} // navegamos a la ruta de edición del proyecto
                                className="block px-3 py-1 text-sm leading-6 text-gray-900"
                              >
                                Editar Proyecto
                              </Link>
                            </Menu.Item>
                            <Menu.Item>
                              <button
                                type="button"
                                className="block px-3 py-1 text-sm leading-6 text-red-500 cursor-pointer"
                                // ponemos en la url el modal para eliminar el proyecto
                                onClick={() =>
                                  navigate(
                                    location.pathname +
                                      `?deleteProject=${project._id}`
                                  )
                                }
                              >
                                Eliminar Proyecto
                              </button>
                            </Menu.Item>
                          </>
                        )}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          /*si no tiene nada se muestra este mensaje */
          <p className="text-center py-20">
            No hay proyectos aún{" "}
            {/* navegamos a la ruta de creación de proyectos */}
            <Link to="/projects/create" className="text-fuchsia-500 font-bold">
              Crear Proyecto
            </Link>
          </p>
        )}
        <DeleteProjectModal />
      </>
    );
}
