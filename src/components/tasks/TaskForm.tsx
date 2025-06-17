// Importamos tipos de react-hook-form para tipar props relacionadas al formulario
import type { FieldErrors, UseFormRegister } from "react-hook-form";
// Importamos el tipo de datos que usará este formulario (nombre y descripción)
import type { TaskFormData } from "@/types/index";
// Importamos un componente personalizado para mostrar errores de validación
import ErrorMessage from "../ErrorMessage";

// Definimos las props que acepta este componente
type TaskFormProps = {
  errors: FieldErrors<TaskFormData>;
  register: UseFormRegister<TaskFormData>;
};

export default function TaskForm({ errors, register }: TaskFormProps) {
  return (
    <>
      <div className="flex flex-col gap-5">
        <label className="font-normal text-2xl" htmlFor="name">
          Nombre de la tarea
        </label>
        <input
          id="name"
          type="text"
          placeholder="Nombre de la tarea"
          className="w-full p-3  border-gray-300 border"
          // Usamos register para conectar este input al sistema de validación
          {...register("name", {
            required: "El nombre de la tarea es obligatorio",
          })}
        />
        {/* Si hay un error en este campo, lo mostramos con el componente ErrorMessage */}
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
      </div>

      <div className="flex flex-col gap-5">
        <label className="font-normal text-2xl" htmlFor="description">
          Descripción de la tarea
        </label>
        <textarea
          id="description"
          placeholder="Descripción de la tarea"
          className="w-full p-3  border-gray-300 border"
          // Usamos register aquí también para validación y recolección del valor
          {...register("description", {
            required: "La descripción de la tarea es obligatoria",
          })}
        />
        {/* Si hay error en la descripción, lo mostramos */}
        {errors.description && (
          <ErrorMessage>{errors.description.message}</ErrorMessage>
        )}
      </div>
    </>
  );
}
