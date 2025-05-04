import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Menubar } from "@radix-ui/react-menubar";
import NewFormDialog from "./NewFormDialog";
import { useCallback, useEffect, useState } from "react";
import File from "../../../components/functional/File";
import { invoke, isTauri } from "@tauri-apps/api/core";
import { useParams } from "react-router";
import Dropzone, { useDropzone } from 'react-dropzone';
import { listen } from "@tauri-apps/api/event";


const FormCard = ({ updateView }: any) => {

    let { projectName } = useParams();

    listen('tauri://file-drop', (event) => {
        console.log("File imported", event);
        updateView();
    })



    const readForms = async (path: string) => {
        console.log("Filesread started!");
        const files: string[] = await invoke(`list_xml_files`, { path });
        console.log("Files: ", files);
        const formFileNames = files.map((fileName) => fileName.split("/").pop());
        //Remove undefined values
        const filteredFormFileNames = formFileNames.filter((name) => name !== undefined);
        setForms(filteredFormFileNames);
        return files;
    }

    useEffect(() => {
        readForms(`./projects/${projectName}/forms`);
    }, []);

    const [forms, setForms] = useState<string[]>([]);
    const [waitingForImport, setWaitingForImport] = useState(false);

    const onDrop = useCallback(acceptedFiles => {
        console.log("Files dropped: ");
        // Do something with the files
        // TODO: Create JSON from XML
        // TODO: Check if correct format
        // TODO: Save to folder
    }, [])
    // const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })


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
            {/* <div {...getRootProps({ className: `dropzone w-xl h-20 ${isDragActive && 'bg-blue-500' || 'bg-red-500'}` })}>
                <input {...getInputProps()} />
                <ul>
                    {acceptedFiles.map((file) => (<li key={file.path}>{file.path} - {file.size} bytes</li>))}
                </ul>
            </div> */}

            <Dropzone onDrop={(i) => {
                const reader = new FileReader;
                reader.onload = (e) => {
                    var contents = e.target?.result;
                    //TODO: JSON.stringify
                    console.log("Contents: ", contents);
                    //TODO: Save via TAuri
                };
                //TODO: Validate XML

            }}>
                {({ getRootProps, getInputProps, isDragActive }) => (
                    <div {...getRootProps({ className: `dropzone w-xl h-20 ${isDragActive && 'bg-green-500' || 'bg-yellow-500'}` })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                )}
            </Dropzone>
        </CardContent>
        <CardFooter className="border-t-1 pt-4">
            <NewFormDialog updateFolder={readForms} />
            <Button onClick={() => readForms(`./projects/${projectName}/forms`)} className="w-fit">Refresh</Button>
            <Button onClick={() => { setWaitingForImport(true) }} className="w-fit">Import form</Button>
        </CardFooter>
    </Card>
};

export default FormCard;