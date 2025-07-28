import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import * as ReactDndHtml5Backend from "react-dnd-html5-backend";
import * as ReactDnD from "react-dnd";
import App from "./App.tsx";
import { QueryBuilderDnD } from "@react-querybuilder/dnd";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
      <App />
    </QueryBuilderDnD>
  </StrictMode>
);
