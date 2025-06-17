// importamos el componente Link de React Router para navegar a otra página
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <h1 className="font-black text-center text-4xl text-white">
        Página No Encontrada
      </h1>
      <p className="mt-10 text-center text-white">
        La página que estás buscando no existe, vuelve a{" "}
        <Link to="/" className="text-fuchsia-500">
          Proyectos
        </Link>
      </p>
    </>
  );
}
