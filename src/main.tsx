/** 
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>
);
*/
// Importamos React, necesario para trabajar con JSX y componentes
import React from "react";
// Importamos ReactDOM, que nos permite renderizar React en el DOM del navegador
import ReactDOM from "react-dom/client";
// Importamos QueryClient y QueryClientProvider desde la librería react-query
// - QueryClient: se usa para configurar la caché y el comportamiento general de las peticiones
// - QueryClientProvider: permite que toda tu app use React Query (proporciona el cliente a través del contexto)
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Importamos React Query Devtools para ver los datos de las peticiones
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// Importamos los estilos globales definidos en index.css
import "./index.css";
// Importamos el componente de rutas definido en ./router (normalmente contiene todas las rutas de la app)
import Router from "./router";

// Creamos una instancia del cliente de React Query
// Esta instancia manejará todas las peticiones, caché, reintentos, etc.
const queryClient = new QueryClient();

// Usamos ReactDOM.createRoot para crear el punto de entrada de nuestra aplicación React
// `document.getElementById("root")` selecciona el div con id="root"
// `as HTMLElement` es una afirmación del type para asegurarle a TypeScript que el elemento existe y es un HTMLElement
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // React.StrictMode es una herramienta para detectar posibles problemas en la aplicación (solo se ejecuta en desarrollo)
  <React.StrictMode>
    {/*Usamos el proveedor QueryClientProvider para envolver nuestra app*/}
    {/*Esto permite que cualquier componente dentro de la app pueda usar los hooks de React Query (como useQuery, useMutation, etc.)*/}
    <QueryClientProvider client={queryClient}>
      {/* Renderizamos el componente Router, que contiene toda la lógica de enrutamiento de la app */}
      <Router />
      {/* Renderizamos el componente React Query Devtools para ver los datos de las peticiones */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
