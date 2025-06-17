// importamos el hook de react-hook-form para manejar el formulario
import { useForm } from "react-hook-form";
// importamos el type del formulairo de notas
import type { NoteFormData } from "@/types/index";
// importamos el componente de error
import ErrorMessage from "@/components/ErrorMessage";
// importamos el hook de react query para hacer peticiones a la API y modificar datos del servidor y useQueryClient para invalidar los datos
import { useMutation, useQueryClient } from "@tanstack/react-query";
// importamos el componente de toast para mostrar los mensajes al usuario, aqui es la parte funcional
import { toast } from "react-toastify";
// funcion para crear notas
import { createNote } from "@/api/NoteAPI";
// importamos el hook de react router para obtener el id del proyecto y uselocation para obtener la url y usenavigate para navegar a otra página
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function AddNoteForm() {
  // creamos una variable de tipo useParams para obtener el id del proyecto
  const params = useParams();
  // creamos una variable con el id del proyecto
  const location = useLocation();
  // creamos una variable de tipo URLSearchParams para obtener el id del proyecto
  const queryParams = new URLSearchParams(location.search);
  // creamos una variable con el id del proyecto
  const navigate = useNavigate();
  const projectId = params.projectId!;
  // creamos una variable con el id de la tarea
  const taskId = queryParams.get("viewTask")!;
  // iniciamos los valores de la nota
  const initialValues: NoteFormData = {
    content: "",
  };

  // creamos el hook de react-hook-form para manejar el formulario
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  // creamos una variable de tipo useQueryClient para poder invalidar o reiniciar los datos previos de la consulta
  const queryClient = useQueryClient();
  // creamos una variable de tipo useMutation que utilizaremos para hacer peticiones a la API
  const { mutate } = useMutation({
    // la función que llamaremos cuando se llame a mutation
    mutationFn: createNote,
    // cuando ocurra un error, se ejecuta esta función
    onError: (error) => {
      toast.error(error.message);
    },
    // cuando se ejecute correctamente, se ejecuta esta función
    onSuccess: (data) => {
      // si la función se ejecuta sin errores, mostramos un mensaje de éxito
      toast.success(data);
      // reseteamos el formulario
      reset();
      // Invalidamos la caché
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      navigate(location.pathname, { replace: true }); // navegamos a la página en la que estamos
    },
  });

  // creamos el handleSubmit para enviar el formulario
  const handleAddNote = (formData: NoteFormData) => {
    mutate({ projectId, taskId, formData });
  };

  return (
    <form
      onSubmit={handleSubmit(handleAddNote)}
      className="space-y-3"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="content">
          Crear Nota
        </label>
        <input
          id="content"
          type="text"
          placeholder="Escribe tu nota"
          className="w-full p-3 border-gray-300"
          {...register("content", { required: "El contenido es obligatorio" })}
        />
        {/** Mostrar error si existe */}
        {errors.content && (
          <ErrorMessage>{errors.content.message}</ErrorMessage>
        )}
      </div>
      <input
        type="submit"
        value="Crear Nota"
        className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-black cursor-pointer"
      />
    </form>
  );
}
