// importamos useParams para obtener los parámetros de la URL y navigate para navegar a otra página
import { Navigate, useParams } from "react-router-dom";
// importamos useQuery para hacer peticiones a la API
import { useQuery } from "@tanstack/react-query";
// importamos la función para mostrar los proyectos por id
import { getProjectById } from "@/api/ProjectAPI";
// importamos el componente de formulario para editar el proyecto
import EditProjectForm from "@/components/projects/EditProjectForm";

export default function EditProjectView() {
  const params = useParams();
  // creamos una variable con el id del proyecto
  const projectId = params.projectId!;
  // creamos una variable de tipo useQuery para hacer peticiones a la API
  const { data, isLoading, isError } = useQuery({
    // siempre debe tener un querykey y debe ser único
    queryKey: ["editProject", projectId],
    // la función que se ejecutará cuando se ejecute la consulta
    queryFn: () => getProjectById(projectId),
    // ponemos retry a false para que no se vuelva a ejecutar la consulta si falla
    retry: false,
  });
  // mientas esta cargando mostramos un mensaje de cargando
  if (isLoading) return "Cargando...";
  // si hay algun error mostramos el mensaje de error
  if (isError) return <Navigate to="/404" />;
  // si tenemos algo en data mostramos el formulario de edición
  if (data) return <EditProjectForm data={data} projectId={projectId} />;
}
