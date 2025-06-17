// importamos el error de axios
import { isAxiosError } from "axios";
// importamos la base de nuestras consultas
import api from "@/lib/axios";
// importamos los types de datos del proyecto, del usuario al que agregar y del formulario de agregar miembros al equipo
import {
  teamMembersSchema,
  type Project,
  type teamMember,
  type teamMemberForm,
} from "@/types/index";

// creamos una función asíncrona para buscar usuarios por email
export async function findUserByEmail({
  projectId,
  formData,
}: {
  projectId: Project["_id"];
  formData: teamMemberForm;
}) {
  try {
    // creamos la url para la ruta de buscar usuarios
    const url = `/projects/${projectId}/team/find`;
    // enviamos el formulario a la API con la url y el método post con los datos de formData
    const { data } = await api.post(url, formData);
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

// creamos una función asíncrona para agregar usuarios a un proyecto
export async function addUserToProject({
  projectId,
  id,
}: {
  projectId: Project["_id"];
  id: teamMember["_id"];
}) {
  try {
    // creamos la url para la ruta del equipo
    const url = `/projects/${projectId}/team`;
    // enviamos la peticion con la url y el método post con el id del usuario
    const { data } = await api.post<string>(url, { id });
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

// creamos una función asíncrona para ver los usuarios de un proyecto
export async function getProjectTeam(projectId: Project["_id"]) {
  try {
    // creamos la url para la ruta del equipo
    const url = `/projects/${projectId}/team`;
    // enviamos la peticion con la url y el método get
    const { data } = await api(url);
    // parseamos el data con el schema de usuarios
    const response = teamMembersSchema.safeParse(data);
    // si el data tiene el mismo esquema que el schema de usuarios, devolvemos el data
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

// creamos una función asíncrona para eliminar usuarios de un proyecto
export async function removeUserFromProject({
  projectId,
  userId,
}: {
  projectId: Project["_id"];
  userId: teamMember["_id"];
}) {
  try {
    // creamos la url para la ruta deeliminar usuarios del equipo
    const url = `/projects/${projectId}/team/${userId}`;
    // enviamos la peticion con la url y el método delete con el id del usuario en la url
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
