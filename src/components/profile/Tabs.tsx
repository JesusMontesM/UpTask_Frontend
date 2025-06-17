// Importamos íconos de Heroicons
import { FingerPrintIcon, UserIcon } from "@heroicons/react/20/solid";
// Importamos hooks de React Router para navegacion y acceder a la url
import { Link, useLocation, useNavigate } from "react-router-dom";

// Creamos un array con los tabs disponibles y sus propiedades
const tabs = [
  { name: "Mi Cuenta", href: "/profile", icon: UserIcon },
  {
    name: "Cambiar Contraseña",
    href: "/profile/password",
    icon: FingerPrintIcon,
  },
];

// Función para juntar clases condicionalmente
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Componente principal que muestra tabs responsivos
export default function Tabs() {
  // Hook para redireccionar
  const navigate = useNavigate();
  // Hook para obtener la ruta actual
  const location = useLocation();

  // Detectamos qué tab está activo basándonos en la ruta
  const currentTab = tabs.filter((tab) => tab.href === location.pathname)[0]
    .href;

  return (
    <div className="mb-10">
      {/* menú desplegable (select) */}
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-purple-800 focus:ring-purple-800"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            navigate(e.target.value)
          } // Redirecciona al seleccionar
          value={currentTab} // Tab actual seleccionado
        >
          {tabs.map((tab) => {
            return (
              <option value={tab.href} key={tab.name}>
                {tab.name}
              </option>
            );
          })}
        </select>
      </div>

      {/*navegación con enlaces */}
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.href} // Redirige al hacer clic
                className={classNames(
                  // Estilo dinámico según si el tab está activo
                  location.pathname === tab.href
                    ? "border-purple-800 text-purple-800"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                )}
              >
                <tab.icon
                  className={classNames(
                    // Ícono también cambia color si el tab está activo
                    location.pathname === tab.href
                      ? "text-purple-800"
                      : "text-gray-400 group-hover:text-gray-500",
                    "-ml-0.5 mr-2 h-5 w-5"
                  )}
                  aria-hidden="true"
                />
                <span>{tab.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
