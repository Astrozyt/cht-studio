import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useParams } from "react-router";

const NewFormDialog = ({ updateFolder }: any) => {

    let { projectName } = useParams();


    const createNewForm = async () => {
        const result = await invoke("create_json_file", { path: `./projects/${projectName}/forms/${newFormName}.json`, content: JSON.stringify({}) });
        // console.log("Result", result);
    }

    const [newFormName, setNewFormName] = useState("");
    const [textError, setTextError] = useState(false);

    const updateFormName = (name: string) => {
        //Regex on name to find certain letters
        const regex = /[^a-zA-Z\d]/g;
        regex.test(name) ? setTextError(true) : setTextError(false);
        name = name.replace(regex, "");
        setNewFormName(name);
    }



    return (<Dialog>
        <DialogTrigger asChild>
            <Button variant="outline">Create new Form</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>New Form</DialogTitle>
                <DialogDescription>
                    <h1 className="mb-12 text-center">Name of new Form</h1>
                    <p className="text-red-500">{textError ? "Only digits and (english) letters are allowed." : ""}</p>
                    <input type="text" onInput={e => { updateFormName((e.target as HTMLInputElement).value) }} value={newFormName} placeholder="Form name" className="mb-4" />
                </DialogDescription>
            </DialogHeader>

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => { setNewFormName(""); }}>Cancel</Button>
                </DialogClose>

                <DialogClose asChild>
                    <Button type="button" variant="default" onClick={() => { createNewForm().then(() => { console.log("CreatedForm"); updateFolder(); }) }}>Create</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>)
}

export default NewFormDialog;