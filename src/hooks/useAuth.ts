// importamos la función para obtener el usuario
import { getUser } from "@/api/AuthAPI";
// importamos useQuery para hacer peticiones a la API
import { useQuery } from "@tanstack/react-query";

// creamos una función que nos permitirá revisar si el usuario está autentificado

export const useAuth = () => {
  // creamos una variable de tipo useQuery para hacer peticiones a la API
  const { data, isError, isLoading } = useQuery({
    // siempre debe tener un querykey y debe ser único
    queryKey: ["user"],
    // la función que se ejecutará cuando se ejecute la consulta
    queryFn: () => getUser(),
    // ponemos retry a 1 para que se vuelva a ejecutar la consulta si falla solo una vez
    retry: 1,
    // ponemos false a refetchOnWindowFocus para que no se vuelva a ejecutar la consulta si cambia de pestaña
    refetchOnWindowFocus: false,
  });
  return {
    data,
    isError,
    isLoading,
  };
};
