// importamos el schema de tareas
import { taskSchema } from "@/types/index";
// importamos el error de axios
import { isAxiosError } from "axios";
// importamos la base de nuestras consultas
import api from "@/lib/axios";
// importamos los types de datos del formulario, del proyecto y de las tareas
import type { Project, Task, TaskFormData } from "@/types/index";

// creamos un type para el tipo de datos que necesitamos al crear una tarea
type TaskAPI = {
  formData: TaskFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
  status: Task["status"];
};

// creamos una función asíncrona para crear una tarea
export async function createTask({
  formData,
  projectId,
}: // typamos con el type de TaskAPI para poder usar el formData y el projectId pero con pick por si escala en un futuro
Pick<TaskAPI, "formData" | "projectId">) {
  try {
    // creamos la url para la ruta de creación de tareas
    const url = `/projects/${projectId}/tasks`;
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

// creamos una función asíncrona para ver una tarea por su id
export async function getTaskById({
  projectId,
  taskId,
}: // typamos con el type de TaskAPI para poder usar el projectId y el taskId pero con pick por si escala en un futuro
Pick<TaskAPI, "projectId" | "taskId">) {
  try {
    // creamos la url para la ruta de creación de tareas
    const url = `/projects/${projectId}/tasks/${taskId}`;
    // enviamos el formulario a la API con la url y el método get
    const { data } = await api(url);
    // parseamos el data con el schema de tareas
    const response = taskSchema.safeParse(data);
    console.log(response);
    // si el data tiene el mismo esquema que el schema de tareas, devolvemos el data
    if (response.success) {
      // return para poder usar el data en otras funciones
      return response.data;
    }
  } catch (error) {
    // si el error es un axios error y tiene una respuesta, devolvemos el mensaje de error
    if (isAxiosError(error) && error.response) {
      // creamos un error para mostrarlo al usuario
      throw new Error(error.response.data.error);
    }
  }
}

// creamos una función asíncrona para editar una tarea
export async function updatedTask({
  projectId,
  taskId,
  formData,
}: // typamos con el type de TaskAPI para poder usar el projectId, el taskId y el formData pero con pick por si escala en un futuro
Pick<TaskAPI, "projectId" | "taskId" | "formData">) {
  try {
    // creamos la url para la ruta de editar tareas
    const url = `/projects/${projectId}/tasks/${taskId}`;
    // enviamos el formulario a la API con la url, el método put y el formData con los datos editados
    const { data } = await api.put<string>(url, formData);
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

// creamos una función asíncrona para eliminar una tarea
export async function deleteteTask({
  projectId,
  taskId,
}: // typamos con el type de TaskAPI para poder usar el projectId y el taskId pero con pick por si escala en un futuro
Pick<TaskAPI, "projectId" | "taskId">) {
  try {
    // creamos la url para la ruta de eliminar tareas
    const url = `/projects/${projectId}/tasks/${taskId}`;
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

// creamos una función asíncrona para editar el estado de una tarea
export async function updateStatus({
  projectId,
  taskId,
  status,
}: // typamos con el type de TaskAPI para poder usar el projectId y el taskId pero con pick por si escala en un futuro
Pick<TaskAPI, "projectId" | "taskId" | "status">) {
  try {
    // creamos la url para la ruta de editar el estado de las tareas
    const url = `/projects/${projectId}/tasks/${taskId}/status`;
    // enviamos el formulario a la API con la url, el método post y el estado del task
    const { data } = await api.post<string>(url, { status });
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
