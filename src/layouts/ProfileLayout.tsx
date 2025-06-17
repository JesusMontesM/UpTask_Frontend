// importamos el componente Outlet para renderizar el componente de la ruta
import { Outlet } from "react-router-dom";
// importamos nuestro componente Tabs
import Tabs from "@/components/profile/Tabs";

// creamos la función de layout
export default function ProfileLayout() {
  return (
    <>
      <Tabs />
      <Outlet />
    </>
  );
}
