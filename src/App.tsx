import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Link } from "react-router";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [projectNames, setProjectNames] = useState<string[]>([]);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  const readProjectFolder = async () => {
    const projectPaths: string[] = await invoke("open_folder", {path: "./projects"}) || [];
    const projectFileNames = projectPaths.map((path) => path.split("/").pop());
    //Remove undefined values
    const filteredProjectFileNames = projectFileNames.filter((name) => name !== undefined);
    console.log("Project file names:", filteredProjectFileNames);
    setProjectNames(filteredProjectFileNames);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={reactLogo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={greet}>Greet</button>
        </div>
        <p>{greetMsg}</p>
      </header>
      <Link to="/test">To test!</Link>
      <button onClick={readProjectFolder}>Open Folder</button>
      <h1>Projects</h1>
      {projectNames.map((projectName, index) => <Link to={`/projects/${projectName}`} ><div key={index}>{projectName}</div></Link>)}
    </div>
  );
}

export default App;
