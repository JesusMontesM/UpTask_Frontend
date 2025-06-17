export function formatDate(isoString: string): string {
  // creamos una nueva instancia de Date con el string de fecha ISO
  const date = new Date(isoString);
    // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    return "Fecha inválida";
  }
  // creamos una nueva instancia de Intl.DateTimeFormat con el idioma y las opciones de formato
  const formatter = new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  // formateamos la fecha con el formato especificado
  return formatter.format(date);
}
