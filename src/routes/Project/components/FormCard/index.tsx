import { FormEditor } from "@/components/projects/Formbuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { parseXFormDoc } from "@ght/xformparser";
import { Menubar } from "@radix-ui/react-menubar";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import Dropzone from 'react-dropzone';
import { useParams } from "react-router";
import File from "../../../../components/functional/File";
import NewFormDialog from "../NewFormDialog";
import { BodyNode } from "./extractBody";
import { writeTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";


const FormCard = ({ updateView }: any) => {

    let { projectName } = useParams();

    listen('tauri://file-drop', (event) => {
        console.log("Tauri: File dropped:", event.payload);
        updateView();
    })


    const readForms = async (path: string) => {
        const files: string[] = await invoke(`list_xml_files`, { path });
        const formFileNames = files.map((fileName) => fileName.split("/").pop());
        const filteredFormFileNames = formFileNames.filter((name) => name !== undefined);
        setForms(filteredFormFileNames);
        return files;
    }

    useEffect(() => {
        readForms(`./projects/${projectName}/forms`);
    }, []);

    const [forms, setForms] = useState<string[]>([]);
    const [importedModel, setImportedModel] = useState<BodyNode[] | null>(null);



    return <Card className="m-4">
        <CardHeader>
            <Menubar>
                <h1>Forms</h1>
            </Menubar>
        </CardHeader>
        <CardContent>
            {forms.map((form, index) => (
                <div key={index}>
                    <File name={form} isFolder={false} isForm />
                </div>
            ))}

            <Dropzone onDrop={(i) => {
                const reader = new FileReader();
                const fileName = i[0].name;
                reader.readAsText(i[0]);

                reader.onload = async (e) => {
                    var contents = e.target?.result;
                    console.log("e:", e);
                    if (!contents) {
                        console.error("No contents found in file");
                        return;
                    }
                    const fullModel = parseXFormDoc([new DOMParser().parseFromString(contents as string, "text/xml")]);
                    setImportedModel(fullModel);
                    //TODO: Save the form to the project folder
                    console.log("Full model extracted:", fullModel);
                    const saveResult = await writeTextFile(`tauri/projects/${projectName}/forms/${fileName}.json`, contents as string, { baseDir: BaseDirectory.AppLocalData });
                    // const result = await invoke('save_json_form', { path: `./projects/${projectName}/forms/${fileName}.json`, content: JSON.stringify(fullModel) });
                    console.log("Form saved:", saveResult);
                };

            }}>
                {({ getRootProps, getInputProps, isDragActive }) => (
                    <div {...getRootProps({ className: `dropzone w-xl h-20 ${isDragActive && 'bg-green-500' || 'bg-yellow-500'}` })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                )}
            </Dropzone>

            {<FormEditor formModel={importedModel} />}

        </CardContent>
        <CardFooter className="border-t-1 pt-4">
            <NewFormDialog updateFolder={readForms} />
            <Button onClick={() => readForms(`./projects/${projectName}/forms`)} className="w-fit">Refresh</Button>
        </CardFooter>
    </Card>
};

export default FormCard;