import { Edit, FileSpreadsheet, Folder, Play, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { invoke } from "@tauri-apps/api/core";
import { BaseDirectory } from "@tauri-apps/plugin-fs";

type FileProps = {
    name: string;
    isFolder: boolean;
    isForm?: boolean;
    projectName?: string; // Optional, used for forms
    updateFn?: () => void; // Optional, used to refresh the file list after deletion
    deleteFn?: (path: string) => void;
};

const File = ({ isFolder, name, isForm, updateFn, deleteFn }: FileProps) => {

    let { projectName } = useParams();


    let navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    return (
        <Card className="size-40 m-8 ">
            <CardHeader className="text-center p-0"><p className="w-36 text-nowrap overflow-hidden">{name}</p></CardHeader>
            <CardContent className="flex justify-around">{isFolder ? <Folder /> : <FileSpreadsheet />}</CardContent>

            <CardFooter className="text-center px-0">
                <Button variant="ghost" className="w-1/3 border-t" onClick={async () => {
                    // Pass the respective path to xformify
                    // navigate(`${isForm ? 'forms/' : ''}${name}/emulate`) 
                    // const xml = await invoke<string>("xformify", { input: JSON.stringify(name) });
                    console.log("AA:", BaseDirectory.AppLocalData, name);
                    console.log("BB:", `projects/${projectName}/forms/${name}`);
                    const xml = await invoke<string>("xformify", { relPath: `projects/${projectName}/forms/${name}` });
                    console.log("Generated XML:", xml);
                }}>
                    <Play />
                </Button>
                <Separator className="h-8" orientation="vertical" />
                <Button variant="ghost" className="w-1/3 border-t" onClick={() => { navigate(`${isForm ? 'forms/' : ''}${name}`) }}>
                    <Edit />
                </Button>
                <Separator className="h-8" orientation="vertical" />
                <Button variant="ghost" onClick={() => setIsOpen(true)} className="w-1/3 border-t">
                    <Trash />
                </Button>

                <AlertDialog open={isOpen}>
                    {/* <AlertDialogTrigger className="w-1/3 border-t justify-items-center h-full" variant="ghost"> <Trash /></AlertDialogTrigger> */}
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete that project and cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => { setIsOpen(false) }}>Back</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { deleteFn && deleteFn(name); setIsOpen(false); updateFn && updateFn(); }}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </CardFooter>
        </Card>
    );
}

export default File;