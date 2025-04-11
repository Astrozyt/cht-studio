import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router";
import Test from "./components/test";
import Project from "./components/projects";
import AppLayout from "./components/AppLyout";
import Emulator from "./components/projects/Emulator";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
      <Route path="/" element={<App />} />
      <Route path="/test" element={<Test />} />
      <Route path="/projects/:projectName" element={<Project/>} />
      {/* <Route path="/projects/edit/:projectName" element={<FormEditor/>} /> */}
      <Route path="/projects/:projectName/emulate" element={<Emulator/>} />
      <Route path="/projects/:projectName/overview" element={<Project />} />
      {/* <Route path="/projects/:projectName/forms" element={<FormEditor />} /> */}

      </Route>
    </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
