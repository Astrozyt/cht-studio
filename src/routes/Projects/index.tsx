import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menubar } from "@/components/ui/menubar";
import { BaseDirectory, DirEntry, readDir } from "@tauri-apps/plugin-fs";
import File from "../../components/functional/File";
import NewProjectDialog from "./components/NewProjectDialog";


const Projects = () => {

    const readProjectsFolder = async () => {
        const projectPaths: DirEntry[] = await readDir("projects", { baseDir: BaseDirectory.AppData, })
        const projectFileNames = projectPaths.map((entry) => entry.name);
        const filteredProjectFileNames = projectFileNames.filter((name) => name !== undefined);
        setProjectNames(filteredProjectFileNames);
    }

    const [projectNames, setProjectNames] = useState<string[]>([]);

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
                {projectNames.length > 0 ? projectNames.map((projectName, index) => <File key={index} name={projectName} isFolder />) : <div><p>No projects yet</p><NewProjectDialog updateFolder={readProjectsFolder} /></div>}
            </div >
        </>
    );
}


export default Projects;
