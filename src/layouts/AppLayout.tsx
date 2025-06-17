// importamos el componente que nos servira de de placeholder para renderizar nuestras rutas
import { Outlet } from "react-router-dom";
// importamos el componente de toastscontainer para mostrar los mensajes al usuario, aqui es la parte visual
import { ToastContainer } from "react-toastify";
// importamos los estilos para el componente de toastscontainer
import "react-toastify/dist/ReactToastify.css";
// importamos el Logo
import Logo from "@/components/Logo";
// importamos el componente NavMenu
import NavMenu from "@/components/NavMenu";
// importamos el componente Link para navegar a otra página
import { Link } from "react-router-dom";
// importamos el hook para obtener el usuario verificado
import { useAuth } from "@/hooks/useAuth";
// importamos el componente de navigate
import { Navigate } from "react-router-dom";

export default function AppLayout() {
  // le asignamos los valores de data, isError y isLoading a useAuth para poder usarlos en el componente
  const { data, isError, isLoading } = useAuth();

  // si esta cargando mostramos un mensaje
  if (isLoading) {
    return "Cargando...";
  }
  // si hay un error es porque no esta autenticado y lo mandamos al login
  if (isError) {
    return <Navigate to="/auth/login" />;
  }

  // si el usuario esta autentificado, mostramos el componente
  if (data)
    return (
      <>
        <header className="bg-gray-800 py-5">
          <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center">
            <div className="w-64">
              {/* importamos el componente Link para navegar a otra página */}
              <Link to={"/"}>
                {/* importamos el logo */}
                <Logo />
              </Link>
            </div>
            <NavMenu
              // pasamos al componente datos para poder usarlos
              name={data.name}
            />
          </div>
        </header>
        <section className="max-w-screen-2xl mx-auto mt-10 p-5">
          <Outlet />
        </section>
        <footer className="py-5">
          <p className="text-center">
            Todos los derechos reservados {new Date().getFullYear()}
          </p>
        </footer>
        {/* importamos el componente toastscontainer para mostrar los mensajes al usuario */}
        <ToastContainer
          pauseOnHover={false} // para que el toast no se detenga cuando se pase el ratón por encima
          pauseOnFocusLoss={false} // para que el toast no se detenga cuando el usuario no tiene el foco en la ventana
          autoClose={3000} // para que el toast se cierre automaticamente después de 3 segundos
        />
      </>
    );
}
