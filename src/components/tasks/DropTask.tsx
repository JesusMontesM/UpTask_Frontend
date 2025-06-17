// importamos el hook de drag and drop para manejar donde dejar las tareas
import { useDroppable } from "@dnd-kit/core";

// tipamos el componente DropTask
type DropTaskProps = {
  status: string;
};

export default function DropTask({ status }: DropTaskProps) {
  // creamos el hook de drag and drop para manejar donde dejar las tareas
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });
  // isover se vuelve true cuando soltamos el elemento en su drop
  const style = {
    opacity: isOver ? 0.4 : undefined,
  };
  return (
    <div
      style={style}
      ref={setNodeRef}
      className="text-xs font-semibold uppercase p-2 border border-dashed border-slate-500 mt-5 grid place-content-center text-slate-500"
    >
      Soltar tarea aquí
    </div>
  );
}
