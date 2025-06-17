// importamos los types del proyecto y del usuario del equipo
import type { Project, teamMember } from "../types";

// creamos una función para verificar si un usuario es el manager de un proyecto
export const isManager = (
  managerId: Project["manager"],
  userId: teamMember["_id"]
) => {
  return managerId === userId;
};
