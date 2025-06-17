// importamos el error de axios
import { isAxiosError } from "axios";
// importamos los types necesarios
import {
  type Note,
  type NoteFormData,
  type Project,
  type Task,
} from "@/types/index";
// importamos la base de nuestras consultas
import api from "@/lib/axios";

// creamos types para NoteAPI
type NoteAPIType = {
  formData: NoteFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
  noteId: Note["_id"];
};

// creamos una función asíncrona para agregar notas a una tarea
export async function createNote({
  projectId,
  taskId,
  formData,
}: Pick<NoteAPIType, "projectId" | "taskId" | "formData">) {
  try {
    // creamos la url para la ruta de crear notas
    const url = `/projects/${projectId}/tasks/${taskId}/notes`;
    // enviamos el formulario a la API con la url y el método post con los datos de formData
    const { data } = await api.post<string>(url, formData);
    // return para poder usar el data en otras funciones
    return data;
  } catch (error) {
    // si el error es un axios error y tiene una respuesta, devolvemos el mensaje de error
    if (isAxiosError(error) && error.response) {
      // creamos un error para mostrarlo al usuario
      throw new Error(error.response.data.error);
    }
  }
}

// creamos una función asíncrona para eliminar notas de una tarea
export async function deleteNote({
  projectId,
  taskId,
  noteId,
}: Pick<NoteAPIType, "projectId" | "taskId" | "noteId">) {
  try {
    // creamos la url para la ruta de crear notas
    const url = `/projects/${projectId}/tasks/${taskId}/notes/${noteId}`;
    // enviamos el formulario a la API con la url y el método delete
    const { data } = await api.delete<string>(url);
    // return para poder usar el data en otras funciones
    return data;
  } catch (error) {
    // si el error es un axios error y tiene una respuesta, devolvemos el mensaje de error
    if (isAxiosError(error) && error.response) {
      // creamos un error para mostrarlo al usuario
      throw new Error(error.response.data.error);
    }
  }
}
