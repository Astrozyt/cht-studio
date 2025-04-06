import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router";
import Test from "./components/test";
import Project from "./components/projects";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/test" element={<Test />} />
      <Route path="/projects/:projectName" element={<Project/>} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
