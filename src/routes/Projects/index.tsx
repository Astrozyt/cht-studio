import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import { Link } from "react-router";
import File from "../../components/functional/File";
import NewProjectDialog from "./components/NewProjectDialog";
import { Button } from "@/components/ui/button";
import { Menubar } from "@/components/ui/menubar";

const Projects = () => {

    const readProjectsFolder = async () => {
        const projectPaths: string[] = await invoke("open_folder", { path: "./projects" }) || [];
        const projectFileNames = projectPaths.map((path) => path.split("/").pop());
        //Remove undefined values
        const filteredProjectFileNames = projectFileNames.filter((name) => name !== undefined);
        setProjectNames(filteredProjectFileNames);
    }

    const [projectNames, setProjectNames] = useState<string[]>([]);
    const [refreshCount, setRefreshCount] = useState(0);
    useEffect(() => {
        readProjectsFolder();

    }, []);

    return (
        <>
            <Menubar>
                <h1 className="text-center">Projects</h1>
                <NewProjectDialog updateFolder={readProjectsFolder} />
                <Button variant="outline" onClick={() => { readProjectsFolder() }} className="">Refresh</Button>
            </Menubar>
            <div className="App flex flex-wrap">
                {projectNames.map((projectName, index) => <File key={index} name={projectName} isFolder />)}
            </div >
        </>
    );
}


export default Projects;
