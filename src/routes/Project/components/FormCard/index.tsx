import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { parseXFormDoc } from "@ght/xformparser";
import { Menubar } from "@radix-ui/react-menubar";
import { listen } from "@tauri-apps/api/event";
import { BaseDirectory, readDir, writeTextFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";
import Dropzone from 'react-dropzone';
import { useParams } from "react-router";
import File from "../../../../components/functional/File";
import NewFormDialog from "../NewFormDialog";
import { FilePlus } from "lucide-react";
import { deleteFnFactory } from "@/lib/utils";


const FormCard = ({ updateView }: any) => {

    let { projectName } = useParams();

    listen('tauri://file-drop', (event) => {
        console.log("Tauri: File dropped:", event.payload);
        updateView();
    })


    const readAppForms = async (path: string) => {
        let files = await readDir(path + '/app', { baseDir: BaseDirectory.AppLocalData });
        console.log("Files in forms folder:", files);
        const fileNames = files.filter(entry => entry.name && !entry.name.endsWith(".xml")).map(entry => entry.name);
        setAppForms(fileNames);
    }

    const readContactForms = async (path: string) => {
        let files = await readDir(path + '/contact', { baseDir: BaseDirectory.AppLocalData });
        console.log("Files in " + path + '/contact', files);
        const fileNames = files.filter(entry => entry.name && !entry.name.endsWith(".xml")).map(entry => entry.name);
        setContactForms(fileNames);
    }

    useEffect(() => {
        readAppForms(`./projects/${projectName}/forms`);
        readContactForms(`./projects/${projectName}/forms`);
    }, []);

    const [appForms, setAppForms] = useState<string[]>([]);
    const [contactForms, setContactForms] = useState<string[]>([]);

    // const [importedModel, setImportedModel] = useState<BodyNode[] | null>(null);



    return <>
        <Card className="m-4">
            <CardHeader>
                <Menubar>
                    <h1 className="text-2xl font-semibold">App Forms</h1>
                </Menubar>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-around">
                {appForms.map((form, index) => (
                    <div key={index}>
                        <File projectName={projectName} name={form} isFolder={false} isForm deleteFn={deleteFnFactory(`./projects/${projectName}/forms/${form}`)} updateFn={() => readAppForms(`./projects/${projectName}/forms`)} />
                    </div>
                ))}

                <NewFormDialog updateFolder={() => readAppForms(`./projects/${projectName}/forms`)} TriggerElement={

                    <Card className="size-40 m-8 bg-gray-200">
                        <CardContent className="flex justify-around">
                            <FilePlus className="size-15" />
                        </CardContent>
                        <CardFooter className="text-center">
                            Add new Form
                        </CardFooter>
                    </Card>
                } />

                <Dropzone onDrop={(i) => {
                    const reader = new FileReader();
                    // const fileName = i[0].name;
                    reader.readAsText(i[0]);

                    reader.onload = async (e) => {
                        var contents = e.target?.result;
                        console.log("e:", e);
                        if (!contents) {
                            console.error("No contents found in file");
                            return;
                        }
                        const fullModel = parseXFormDoc([new DOMParser().parseFromString(contents as string, "text/xml")]);
                        // setImportedModel(fullModel);
                        console.log("Full model extracted:", fullModel.title);
                        const saveResult = await writeTextFile(`projects/${projectName}/forms/app/${fullModel.title}.json`, JSON.stringify(fullModel), { baseDir: BaseDirectory.AppLocalData });
                        // TODO: Give Toast feedback
                        console.log("Form saved:", saveResult);
                        readAppForms(`./projects/${projectName}/forms`)
                    };

                }}>
                    {({ getRootProps, getInputProps, isDragActive }) => (
                        <div {...getRootProps({ className: `dropzone w-xl h-20 ${isDragActive && 'bg-green-500' || 'bg-yellow-500'}` })}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                    )}
                </Dropzone>

                {/* {<FormEditor formModel={importedModel} />} */}

            </CardContent>
            <CardFooter className="border-t-1 pt-4">
                {/* <NewFormDialog updateFolder={() => readForms(`./projects/${projectName}/forms`)} /> */}
                <Button onClick={() => readAppForms(`./projects/${projectName}/forms`)} className="w-fit">Refresh</Button>
            </CardFooter>
        </Card>



        <Card className="m-4">
            <CardHeader>
                <Menubar>
                    <h1 className="text-2xl font-semibold">Contact Forms</h1>
                </Menubar>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-around">
                {contactForms.map((form, index) => (
                    <div key={index}>
                        <File projectName={projectName} isContactForm name={form} isFolder={false} isForm deleteFn={deleteFnFactory(`./projects/${projectName}/forms/contact/${form}`)} updateFn={() => readContactForms(`./projects/${projectName}/forms/contact`)} />
                    </div>
                ))}

                {/* <NewFormDialog updateFolder={() => readContactForms(`./projects/${projectName}/forms`)} TriggerElement={

                    <Card className="size-40 m-8 bg-gray-200">
                        <CardContent className="flex justify-around">
                            <FilePlus className="size-15" />
                        </CardContent>
                        <CardFooter className="text-center">
                            Add new Form
                        </CardFooter>
                    </Card>
                } /> */}

                {/* <Dropzone onDrop={(i) => {
                    const reader = new FileReader();
                    // const fileName = i[0].name;
                    reader.readAsText(i[0]);

                    reader.onload = async (e) => {
                        var contents = e.target?.result;
                        console.log("e:", e);
                        if (!contents) {
                            console.error("No contents found in file");
                            return;
                        }
                        const fullModel = parseXFormDoc([new DOMParser().parseFromString(contents as string, "text/xml")]);
                        // setImportedModel(fullModel);
                        console.log("Full model extracted:", fullModel.title);
                        const saveResult = await writeTextFile(`projects/${projectName}/forms/contact/${fullModel.title}.json`, JSON.stringify(fullModel), { baseDir: BaseDirectory.AppLocalData });
                        // TODO: Give Toast feedback
                        console.log("Form saved:", saveResult);
                        readContactForms(`./projects/${projectName}/forms`)
                    };

                }}>
                    {({ getRootProps, getInputProps, isDragActive }) => (
                        <div {...getRootProps({ className: `dropzone w-xl h-20 ${isDragActive && 'bg-green-500' || 'bg-yellow-500'}` })}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                    )}
                </Dropzone> */}

                {/* {<FormEditor formModel={importedModel} />} */}

            </CardContent>
            <CardFooter className="border-t-1 pt-4">
                {/* <NewFormDialog updateFolder={() => readForms(`./projects/${projectName}/forms`)} /> */}
                <Button onClick={() => readContactForms(`./projects/${projectName}/forms`)} className="w-fit">Refresh</Button>
            </CardFooter>
        </Card>
    </>
};

export default FormCard;