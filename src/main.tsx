import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router";
import Project from "./routes/Project";
import AppLayout from "./components/AppLyout";
import Emulator from "./components/projects/Emulator";
import Projects from "./routes/Projects";
import { XmlConnector, XmlEditor, XmlOverview } from "./components/projects/Formbuilder/xmlSnippets";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectName" element={<Project />} />
          <Route path="/projects/:projectName/forms" element={<XmlOverview />} />
          <Route path="/projects/:projectName/forms/:formName" element={<XmlEditor />} />
          <Route path="/projects/:projectName/tasks/" element={<XmlConnector />} />
          <Route path="/projects/:projectName/emulate" element={<Emulator />} />
          <Route path="/projects/:projectName/overview" element={<Project />} />

        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
