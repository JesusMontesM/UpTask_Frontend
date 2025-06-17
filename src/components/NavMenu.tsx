// importamos fragment para agrupar elementos sin agregar nodos al DOM
import { Fragment } from "react";
// importamos popover y transition para crear un menú desplegable
import { Popover, Transition } from "@headlessui/react";
// importamos los iconos para el menú desplegable
import { Bars3Icon } from "@heroicons/react/20/solid";
// importamos link para navegar a otra página
import { Link } from "react-router-dom";
// importamos el type de user
import type { User } from "../types";
// importamos el hook que nos permite invalidar o reiniciar los datos previos de la consulta
import { useQueryClient } from "@tanstack/react-query";

// creamos los types de navmenu
type NavMenuProps = {
  name: User["name"];
};

export default function NavMenu({ name }: NavMenuProps) {
  // creamos una variable de tipo useQueryClient para poder invalidar o reiniciar los datos previos de la consulta
  const queryClient = useQueryClient();

  // creamos una función que nos permitirá cerrar sesión
  const logout = () => {
    // borramos el token de sesión
    localStorage.removeItem("AUTH_TOKEN");
    // invalidamos la caché del usuario
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 p-1 rounded-lg bg-purple-400">
        <Bars3Icon className="w-8 h-8 text-white " />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen lg:max-w-min -translate-x-1/2 lg:-translate-x-48">
          <div className="w-full lg:w-56 shrink rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
            <p className="text-center">Hola: {name}</p>
            <Link to="/profile" className="block p-2 hover:text-purple-950">
              Mi Perfil
            </Link>
            <Link to="/" className="block p-2 hover:text-purple-950">
              Mis Proyectos
            </Link>
            <button
              className="block p-2 hover:text-red-200 cursor-pointer text-red-400"
              type="button"
              onClick={logout}
            >
              Cerrar Sesión
            </button>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
