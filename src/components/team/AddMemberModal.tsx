// Importamos React Fragment para agrupar elementos sin añadir nodos al DOM
import { Fragment } from "react";
// Importamos los componentes de transición y Dialog de Headless UI
import { Dialog, Transition } from "@headlessui/react";
// Importamos hooks de react-router-dom para navegación y lectura de la URL
import { useLocation, useNavigate } from "react-router-dom";
// Importamos nuestro componente para agregar miembros al equipo
import AddMemberForm from "./AddMemberForm";

export default function AddMemberModal() {
  // Hook que permite acceder a la ubicación actual
  const location = useLocation();
  // Hook para redireccionar
  const navigate = useNavigate();

  // Extraemos los parámetros de la URL
  const queryParams = new URLSearchParams(location.search);
  // Verificamos si el parámetro 'addMember' está presente
  const addMember = queryParams.get("addMember");
  // Si existe el parámetro, mostramos el modal
  const show = addMember ? true : false;

  return (
    <>
      {/* Transición para mostrar/ocultar el modal */}
      <Transition appear show={show} as={Fragment}>
        {/* Componente de modal */}
        <Dialog
          as="div"
          className="relative z-10"
          // Al cerrar el modal, eliminamos el parámetro de la URL y redirigimos al mismo path
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

          {/* Contenedor centrado del modal */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              {/* Transición del panel del modal */}
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
                  {/* Título principal del modal */}
                  <Dialog.Title as="h3" className="font-black text-4xl my-5">
                    Agregar Usuario al equipo
                  </Dialog.Title>

                  {/* Subtítulo explicativo */}
                  <p className="text-xl font-bold">
                    Busca el nuevo usuario por email {""}
                    <span className="text-fuchsia-600">
                      para agregarlo al proyecto
                    </span>
                  </p>
                  <AddMemberForm />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
