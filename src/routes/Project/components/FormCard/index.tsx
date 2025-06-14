import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Menubar } from "@radix-ui/react-menubar";
import NewFormDialog from "../NewFormDialog";
import { useCallback, useEffect, useState } from "react";
import File from "../../../../components/functional/File";
import { invoke, isTauri } from "@tauri-apps/api/core";
import { useParams } from "react-router";
import Dropzone, { useDropzone } from 'react-dropzone';
import { listen } from "@tauri-apps/api/event";
import { Input } from "@/components/ui/input";
import { extractITextTranslations } from "./extractTranslations";
import { extractBinds } from "./extractBinds";
import { extractInstanceTree } from "./extractInstance";
import { BodyNode, extractBody } from "./extractBody";
import { FormEditor } from "@/components/projects/Formbuilder";
import { mergeExtractedData } from "./mergeExtractedData";


const FormCard = ({ updateView }: any) => {

    let { projectName } = useParams();

    listen('tauri://file-drop', (event) => {
        updateView();
    })


    const readForms = async (path: string) => {
        const files: string[] = await invoke(`list_xml_files`, { path });
        // console.log("Files: ", files);
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
    const [importedModel, setImportedModel] = useState<BodyNode[] | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("File changed", event);
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const xmlString = e.target?.result;
                // console.log("Contents: ", xmlString);

            }
        }
    }


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
                // console.log("Files dropped: ", i);
                const reader = new FileReader();
                reader.readAsText(i[0]);

                reader.onload = (e) => {
                    var contents = e.target?.result;
                    if (!contents) {
                        console.error("No contents found in file");
                        return;
                    }


                    console.log("Contentsssss: ", contents);
                    const translations = extractITextTranslations(contents as string);
                    console.log("Translations: ", translations);
                    const binds = extractBinds(contents as string);
                    console.log("Binds: ", binds);
                    const instance = extractInstanceTree(contents as string);
                    console.log("Instance: ", instance);
                    const body = extractBody(contents as string);
                    console.log("Body: ", body);
                    //TODO: Save via TAuri
                    const fullNode = mergeExtractedData(body, translations, [], instance);
                    setImportedModel(fullNode);
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

            {/* <Input type="file" accept=".xml" onChange={handleFileChange} className="mt-4 bg-blue-600" /> */}
        </CardContent>
        <CardFooter className="border-t-1 pt-4">
            <NewFormDialog updateFolder={readForms} />
            <Button onClick={() => readForms(`./projects/${projectName}/forms`)} className="w-fit">Refresh</Button>
            <Button onClick={() => { setWaitingForImport(true) }} className="w-fit">Import form</Button>
        </CardFooter>
    </Card>
};

export default FormCard;