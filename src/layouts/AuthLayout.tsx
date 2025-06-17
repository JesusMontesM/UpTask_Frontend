// importamos el componente que nos servira de de placeholder para renderizar nuestras rutas
import { Outlet } from "react-router-dom";
// importamos el componente Logo
import Logo from "@/components/Logo";
// importamos el componente de toastscontainer para mostrar los mensajes al usuario, aqui es la parte visual
import { ToastContainer } from "react-toastify";

export default function AuthLayout() {
  return (
    <>
      <div className="bg-gray-800 min-h-screen">
        <div className="py-10 lg:py-20 mx-auto w-[450px]">
          <Logo />
          <div className="mt-10">
            <Outlet />
          </div>
        </div>
      </div>
      {/* importamos el componente toastscontainer para mostrar los mensajes al usuario */}
      <ToastContainer
        pauseOnHover={false} // para que el toast no se detenga cuando se pase el ratón por encima
        pauseOnFocusLoss={false} // para que el toast no se detenga cuando el usuario no tiene el foco en la ventana
        autoClose={3000} // para que el toast se cierre automaticamente después de 3 segundos
      />
    </>
  );
}
