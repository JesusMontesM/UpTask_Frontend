// importamos link de react router dom para el componente Link
import { Link, useNavigate } from "react-router-dom";
// importamos el hook para los formularios
import { useForm } from "react-hook-form";
import ProjectForm from "@/components/projects/ProjectForm";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor
import { useMutation } from "@tanstack/react-query";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";
// importamos los types de datos del formulario
import type { ProjectFormData } from "@/types/index";
//importamos las funciones de la API
import { createProject } from "@/api/ProjectAPI";

export default function CreateProjectView() {
  // instanciamos el componente useNavigate para navegar a otra página
  const navigate = useNavigate();
  // creamos un objeto de tipo ProjectFormData para el formulario
  const initialValues: ProjectFormData = {
    projectName: "",
    clientName: "",
    description: "",
  };

  // creamos un objeto de tipo ProjectFormData para el formulario
  const {
    register, // register nos registra cada input del formulario
    handleSubmit, // handleSubmit nos permite enviar el formulario si pasamos la validación
    formState: { errors }, // formState contiene los errores del formulario
  } = useForm<ProjectFormData>({ defaultValues: initialValues }); // defaultValues es un objeto que contiene los valores iniciales del formulario

  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  // le aplicamos destructuring y asi podemos usar directamente mutate sin tener que usar mutation.mutate
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: createProject,
    // cuando ocurra un error, se ejecuta esta función
    onError: (error) => {
      toast.error(error.message);
    },
    // cuando se ejecute correctamente, se ejecuta esta función
    onSuccess: (data) => {
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
      navigate("/"); // navegamos a la página principal
    },
  });

  // creamos una función que envíe los datos ingresados
  const handleForm = (formData: ProjectFormData) =>
    // llamamos a la función de mutation con el formulario
    mutate(formData); // mutate es asincrono de base, por lo que no necesitamos await
  return (
    <>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black">Crear Proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Completa el formulario para crear un nuevo proyecto
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
            value="Crear Proyecto"
            className="bg-fuchsia-600 hover:bg-fuchsia-800 cursor-pointer w-full p-3 text-white uppercase font-bold transition-colors"
          />
        </form>
      </div>
    </>
  );
}
