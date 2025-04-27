import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

const NewProjectDialog = ({ updateFolder }: any) => {
    const createNewFolder = async (name: string) => {
        const result = await invoke("create_folder", { name: name });
        console.log("Result", result);
    }

    const [newProjectName, setNewProjectName] = useState("");
    const [textError, setTextError] = useState(false);

    const updateProjectName = (name: string) => {
        //Regex on name to find certain letters
        const regex = /[^a-zA-Z\d]/g;
        regex.test(name) ? setTextError(true) : setTextError(false);
        name = name.replace(regex, "");
        setNewProjectName(name);
    }



    return (<Dialog>
        <DialogTrigger asChild>
            <Button variant="outline">Create new project</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>New Project</DialogTitle>
                <DialogDescription>
                    <h1 className="mb-12 text-center">Name of new project</h1>
                    <p className="text-red-500">{textError ? "Only digits and (english) letters are allowed." : ""}</p>
                    <input type="text" onInput={e => { updateProjectName((e.target as HTMLInputElement).value) }} value={newProjectName} placeholder="Project name" className="mb-4" />
                </DialogDescription>
            </DialogHeader>

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => { setNewProjectName(""); }}>Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button type="button" variant="default" onClick={() => { createNewFolder(newProjectName).then(() => { console.log("CreatedFolder"); updateFolder(); }) }}>Create</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>)
}

export default NewProjectDialog;