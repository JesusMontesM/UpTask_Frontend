// importamos el componente de formulario para agregar notas
import AddNoteForm from "./AddNoteForm";
// importamos el type de Task
import type { Task } from "@/types/index";
// importamos el componente de detalles de las notas
import NoteDetail from "./NoteDetail";

// tipamos
type NotesPanelProps = {
  notes: Task["notes"];
};

export default function NotesPanel({ notes }: NotesPanelProps) {
  return (
    <>
      <AddNoteForm />
      <div className="divide-y divide-gray-100 mt-10">
        {notes.length ? (
          <>
            <p className=" font-bold text-2xl text-slate-600 my-5">Notas:</p>
            {notes.map((note) => (
              <NoteDetail key={note._id} note={note} />
            ))}
          </>
        ) : (
          <p className="text-gray-500 text-center pt-3"> No hay notas</p>
        )}
      </div>
    </>
  );
}
