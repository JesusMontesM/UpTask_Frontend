// importamos link de react router dom para el componente Link y useNavigate para navegar a otra página
import { Link, useNavigate } from "react-router-dom";
// importamos el hook para los formularios
import { useForm } from "react-hook-form";
import ProjectForm from "@/components/projects/ProjectForm";
// importamos los types de datos del formulario
import type { Project, ProjectFormData } from "@/types/index";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor
import { useMutation } from "@tanstack/react-query";
// importamos el hook que nos permite invalidar o reiniciar los datos previos de la consulta
import { useQueryClient } from "@tanstack/react-query";
// importamos la funcion que actualiza el proyecto
import { updateProject } from "@/api/ProjectAPI";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";

// tipamos el componente EditProjectForm para los datos del proyecto
type EditProjectFormProps = {
  data: ProjectFormData;
  projectId: Project["_id"];
};

export default function EditProjectForm({
  data,
  projectId,
}: EditProjectFormProps) {
  // instanciamos el componente useNavigate para navegar a otra página
  const navigate = useNavigate();
  // creamos un objeto de tipo ProjectFormData para el formulario
  const {
    register, // register nos registra cada input del formulario
    handleSubmit, // handleSubmit nos permite enviar el formulario si pasamos la validación
    formState: { errors }, // formState contiene los errores del formulario
  } = useForm<ProjectFormData>({
    // defaultValues es un objeto que contiene los valores iniciales del formulario
    defaultValues: {
      projectName: data.projectName,
      clientName: data.clientName,
      description: data.description,
    },
  });

  // creamos una variable de tipo useQueryClient para poder invalidar o reiniciar los datos previos de la consulta
  const queryClient = useQueryClient();

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  // le aplicamos destructuring y asi podemos usar directamente mutate sin tener que usar mutation.mutate
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: updateProject,
    // cuando ocurra un error, se ejecuta esta función
    onError: (error) => {
      toast.error(error.message);
    },
    // cuando se ejecute correctamente, se ejecuta esta función
    onSuccess: (data) => {
      // Invalidamos la consulta de todos los proyectos para que se actualice la lista general de proyectos,
      // y se reflejen los cambios hechos al proyecto editado en la vista principal
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // Invalidamos la consulta específica del proyecto editado ("editProject", projectId),
      // para asegurar que cualquier vista que dependa de los datos de este proyecto individual
      // reciba la versión más reciente desde la API y no use datos en caché desactualizados
      queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
      navigate("/"); // navegamos a la página principal
    },
  });

  // creamos una función que envíe los datos ingresados al servidor
  const handleForm = (formData: ProjectFormData) => {
    const data = {
      formData,
      projectId,
    };
    mutate(data);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black">Editar Proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Completa el formulario para editar el proyecto seleccionado
        </p>
        <nav className="my-5">
          <Link
            className="bg-purple-400 hover:bg-purple-600 cursor-pointer px-10 py-3 text-white text-xl font-bold transition-colors"
            to="/"
          >
            Volver a Proyectos
          </Link>
        </nav>
        <form
          className="mt-10 bg-white shadow-lg p-10 rounded-lg"
          onSubmit={handleSubmit(handleForm)}
          action=""
          noValidate
        >
          <ProjectForm register={register} errors={errors} />
          <input
            type="submit"
            value="Guardar cambios"
            className="bg-fuchsia-600 hover:bg-fuchsia-800 cursor-pointer w-full p-3 text-white uppercase font-bold transition-colors"
          />
        </form>
      </div>
    </>
  );
}
