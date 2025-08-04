import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router";
import Project from "./routes/Project";
import AppLayout from "./components/AppLayout";
import Emulator from "./components/projects/Emulator";
import Projects from "./routes/Projects";
// import { XmlConnector, XmlOverview } from "./components/projects/Formbuilder_old/xmlSnippets";
import { FormEditorPage } from "./components/projects/FormEditorPage";
// import { FormEditor } from "@ght/formbuilder"

const XmlConnector = () => <div>Xml Connector Placeholder</div>;
const XmlOverview = () => <div>Xml Overview Placeholder</div>;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectName" element={<Project />} />
          <Route path="/projects/:projectName/forms" element={<XmlOverview />} />
          <Route path="/projects/:projectName/forms/:formName" element={<FormEditorPage />} />
          <Route path="/projects/:projectName/tasks/" element={<XmlConnector />} />
          <Route path="/projects/:projectName/emulate" element={<Emulator />} />
          <Route path="/projects/:projectName/overview" element={<Project />} />

        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
