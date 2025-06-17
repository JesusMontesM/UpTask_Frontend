// importamos la base de nuestras consultas
import api from "@/lib/axios";
// importamos los types de datos del formulario
import {
  dashboardProjectSchema,
  editProjectSchema,
  projectSchema,
  type Project,
  type ProjectFormData,
} from "@/types/index";
import { isAxiosError } from "axios";

// creamos una función asíncrona para crear un proyecto
export async function createProject(formData: ProjectFormData) {
  try {
    // enviamos el formulario a la API con la url /projects y el método post con los datos de formData
    const { data } = await api.post("/projects", formData);
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

// creamos una función asíncrona para mostrar los proyectos
export async function getProjects() {
  try {
    // enviamos la url /projects y el método get
    const { data } = await api("/projects");
    // parseamos el data con el schema de proyectos
    const response = dashboardProjectSchema.safeParse(data);
    // si el data tiene el mismo esquema que el schema de proyectos, devolvemos el data
    if (response.success) {
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

// creamos una función asíncrona para mostrar el proyecto por id para su edicion
export async function getProjectById(id: Project["_id"]) {
  try {
    // enviamos la url /projects con el id y el método get
    const { data } = await api(`/projects/${id}`);
    // parseamos el data con el schema de proyectos
    const response = editProjectSchema.safeParse(data);
    // si el data tiene el mismo esquema que el schema de proyectos, devolvemos el data
    if (response.success) {
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

// creamos una función asíncrona para mostrar el proyecto por id por completo
export async function getFullProjectById(id: Project["_id"]) {
  try {
    // enviamos la url /projects con el id y el método get
    const { data } = await api(`/projects/${id}`);
    // parseamos el data con el schema de proyectos
    const response = projectSchema.safeParse(data);
    // si el data tiene el mismo esquema que el schema de proyectos, devolvemos el data
    if (response.success) {
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

type ProjectAPIType = {
  formData: ProjectFormData;
  projectId: Project["_id"];
};

// creamos una función asíncrona para editar un proyecto
export async function updateProject({ formData, projectId }: ProjectAPIType) {
  try {
    // enviamos la url /projects con el id y el método put ademas de los datos del formulario como segundo parámetro
    const { data } = await api.put<string>(`/projects/${projectId}`, formData);
    // retornamos los datos
    return data;
  } catch (error) {
    // si el error es un axios error y tiene una respuesta, devolvemos el mensaje de error
    if (isAxiosError(error) && error.response) {
      // creamos un error para mostrarlo al usuario
      throw new Error(error.response.data.error);
    }
  }
}

// creamos una función asíncrona para eliminar el proyecto por id
export async function deleteProject(id: Project["_id"]) {
  try {
    // enviamos la url /projects con el id y el método delete
    const { data } = await api.delete<string>(`/projects/${id}`);
    // retornamos los datos
    return data;
  } catch (error) {
    // si el error es un axios error y tiene una respuesta, devolvemos el mensaje de error
    if (isAxiosError(error) && error.response) {
      // creamos un error para mostrarlo al usuario
      throw new Error(error.response.data.error);
    }
  }
}
