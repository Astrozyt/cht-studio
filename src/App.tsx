import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Link } from "react-router";
import File from "./components/functional/File";

function App() {

  const createNewProject = (name: string) => {
    //TODO: Implement create new Folder
    //TODO: Check if name already exists
    console.log("Create new project"+name);
    readProjectFolder();
  }

  const readProjectFolder = async () => {
    const projectPaths: string[] = await invoke("open_folder", { path: "./projects" }) || [];
    const projectFileNames = projectPaths.map((path) => path.split("/").pop());
    //Remove undefined values
    const filteredProjectFileNames = projectFileNames.filter((name) => name !== undefined);
    setProjectNames(filteredProjectFileNames);
  }

  const [projectNames, setProjectNames] = useState<string[]>([]);

  useEffect(() => {
    readProjectFolder();

  }, []);

  console.log("names", projectNames)
  return (
    <>
      <h1 className="mb-12 text-center">Projects</h1>
      <div className="App flex flex-wrap">
        <File name="New project" isFolder={true} />
        <File name="New project" isFolder={true} />
        <File name="New project" isFolder={true} />
        <File name="New project" isFolder={true} />
        <File name="New project" isFolder={true} />
        <File name="New project" isFolder={true} />
        <File name="New project" isFolder={true} />
        <File name="New project" isFolder={true} />
        <File name="New project" isFolder={true} />
        <File name="New project" isFolder={true} />
        <File name="New project" isFolder={true} />
        <File name="New project" isFolder={true} />
        <File name="New project" isFolder={true} />

        {projectNames.map((projectName, index) => <Link to={`/projects/${projectName}`} ><File key={index} name={projectName} isFolder/></Link>)}
      </div>
    </>
  );
}

export default App;
