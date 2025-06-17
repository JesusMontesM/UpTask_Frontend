// importamos zod para validar los datos
import { z } from "zod";

/** Auth y User */

// creamos el schema para la autentificacion
export const authSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  current_password: z.string(),
  password: z.string(),
  password_confirmation: z.string(),
  token: z.string(),
});

// asiganmos el schema como un type
type Auth = z.infer<typeof authSchema>;
// exportamons el schema como un type y le asignamos los valores que vamos a necesitar a la hora del login
export type UserLoginForm = Pick<Auth, "email" | "password">;
// exportamons el schema como un type y le asignamos los valores que vamos a necesitar a la hora del registro
export type UserRegistrationForm = Pick<
  Auth,
  "name" | "email" | "password" | "password_confirmation"
>;
// exportamons el schema como un type y le asignamos los valores que vamos a necesitar para enviar el token nuevo
export type RequestConfirmationCodeForm = Pick<Auth, "email">;
// exportamons el schema como un type y le asignamos los valores que vamos a necesitar para reestablecer la contraseña
export type ForgotPasswordForm = Pick<Auth, "email">;
// exportamons el schema como un type y le asignamos los valores que vamos a necesitar para el formulario de la nueva contraseña
export type NewPasswordForm = Pick<Auth, "password" | "password_confirmation">;
// exportamons el schema como un type y le asignamos los valores que vamos a necesitar para el formulario de la nueva contraseña
export type UpdateCurrentUserPasswordForm = Pick<
  Auth,
  "current_password" | "password" | "password_confirmation"
>;
// exportamons el schema como un type y le asignamos los valores que vamos a necesitar del token
export type ConfirmToken = Pick<Auth, "token">;
// exportamons el schema como un type y le asignamos los valores que vamos a necesitar de la contraseña
export type CheckPasswordForm = Pick<Auth, "password">;

/** USER */

// creamos el schema para el usuario
export const userSchema = authSchema.pick({ name: true, email: true }).extend({
  _id: z.string(),
});
// exportamons el schema como un type y le asignamos los valores que vamos a necesitar
export type User = z.infer<typeof userSchema>;
// exportamons el schema como un type y le asignamos los valores que vamos a necesitar
export type UserProfileForm = Pick<User, "name" | "email">;

/** NOTES */

// creamos el schema para las notas
export const noteSchema = z.object({
  _id: z.string(),
  content: z.string(),
  createdBy: userSchema,
  task: z.string(),
  createdAt: z.string(),
});

// exportamos el schema como un type
export type Note = z.infer<typeof noteSchema>;
// exportamos el schema para los formularioscomo un type
export type NoteFormData = Pick<Note, "content">;

/** TASKS */

// creamos el schema para los estados de tareas
export const taskStatusSchema = z.enum([
  "pending",
  "onHold",
  "inProgress",
  "underReview",
  "completed",
]);
// exportamos el schema como un type
export type TaskStatus = z.infer<typeof taskStatusSchema>;

// creamos el schema para las tareas
export const taskSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  project: z.string(),
  status: taskStatusSchema,
  completedBy: z.array(
    z.object({
      _id: z.string(),
      user: userSchema,
      status: taskStatusSchema,
    })
  ),
  notes: z.array(noteSchema.extend({ createdBy: userSchema })),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// creamos el schema para las tareas con menos informacion
export const taskProjectSchema = taskSchema.pick({
  _id: true,
  name: true,
  description: true,
  status: true,
});

// exportamos el schema como un type
export type Task = z.infer<typeof taskSchema>;
export type TaskProject = z.infer<typeof taskProjectSchema>;

// creamos el type para los datos del formulario, usamos pick para que coja los datos seleccionados
export type TaskFormData = Pick<Task, "name" | "description">;

/** PROJECTS */

// creamos el schema para los proyectos
export const projectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
  // creamos un campo para el manager
  manager: z.string(userSchema.pick({ _id: true })),
  tasks: z.array(taskProjectSchema),
  team: z.array(z.string(userSchema.pick({ _id: true }))),
});

// creamos el schema para los proyectos del dashboard como un array porque va a contener todos los proyectos
export const dashboardProjectSchema = z.array(
  // seleccionamos solo los campos que necesitemos con .pick
  projectSchema.pick({
    _id: true,
    projectName: true,
    clientName: true,
    description: true,
    manager: true,
  })
);

// creamos el schema para la edicion de proyectos
export const editProjectSchema = projectSchema.pick({
  projectName: true,
  clientName: true,
  description: true,
});

// exportamos el schema como un type
export type Project = z.infer<typeof projectSchema>;

// creamos el type para los datos del formulario, usamos pick para que coja los datos seleccionados
export type ProjectFormData = Pick<
  Project,
  "projectName" | "clientName" | "description"
>;

/** TEAM */

// creamos el schema para el usuario que pertenece al equipo
export const teamMemberSchema = userSchema.pick({
  name: true,
  email: true,
  _id: true,
});

// creamos el schema para los usuarios que pertenecen al equipo
export const teamMembersSchema = z.array(teamMemberSchema);

// exportamos el schema como un type
export type teamMember = z.infer<typeof teamMemberSchema>;
// creamos el type para el formulario de agregar miembros al equipo, usamos pick para que coja los datos seleccionados
export type teamMemberForm = Pick<teamMember, "email">;
